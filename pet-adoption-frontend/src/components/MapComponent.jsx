import React, { useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useGoogleMaps } from './GoogleMapsProvider';

const MapComponent = forwardRef(({ centers }, ref) => {
    const { isLoaded, loadError, mapId } = useGoogleMaps();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const markersCreatedRef = useRef(false);

    const mapStyles = {
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0
    };

    // Ensure centers is an array and has valid coordinates
    const validCenters = Array.isArray(centers) ? centers.filter(center =>
        center?.latitude && center?.longitude &&
        !isNaN(parseFloat(center.latitude)) &&
        !isNaN(parseFloat(center.longitude))
    ) : [];

    const defaultCenter = validCenters.length > 0 ? {
        lat: parseFloat(validCenters[0].latitude),
        lng: parseFloat(validCenters[0].longitude)
    } : {
        lat: 39.8283, // Default to center of US if no valid centers
        lng: -98.5795
    };

    // Separate map initialization from marker creation
    const initMap = useCallback(async () => {
        if (!window.google || !mapRef.current || mapInstanceRef.current) return;

        try {
            // Load required libraries
            const { Map } = await window.google.maps.importLibrary("maps");

            // Create the map instance
            const mapInstance = new Map(mapRef.current, {
                zoom: validCenters.length === 1 ? 13 : 4,
                center: defaultCenter,
                mapId: mapId,
                disableDefaultUI: true,
                clickableIcons: false,
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                minZoom: 4,
                maxZoom: 20
            });

            mapInstanceRef.current = mapInstance;
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }, [validCenters.length, mapId, defaultCenter]);

    // Modify updateMarkers to only create markers if they haven't been created yet or centers changed
    const updateMarkers = useCallback(async () => {
        if (!window.google || !mapInstanceRef.current) return;

        // Get the current marker positions
        const currentMarkerPositions = markersRef.current.map(marker => ({
            lat: marker.position.lat,
            lng: marker.position.lng
        }));

        // Get the new center positions
        const newMarkerPositions = validCenters.map(center => ({
            lat: parseFloat(center.latitude),
            lng: parseFloat(center.longitude)
        }));

        // Check if markers need to be updated
        const markersNeedUpdate = !markersCreatedRef.current ||
            currentMarkerPositions.length !== newMarkerPositions.length ||
            !currentMarkerPositions.every((pos, idx) =>
                pos.lat === newMarkerPositions[idx].lat &&
                pos.lng === newMarkerPositions[idx].lng
            );

        if (!markersNeedUpdate) return;

        try {
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

            // Clear existing markers
            markersRef.current.forEach(marker => {
                if (marker) marker.map = null;
            });
            markersRef.current = [];

            // Create new markers for each valid center
            for (const center of validCenters) {
                const position = {
                    lat: parseFloat(center.latitude),
                    lng: parseFloat(center.longitude)
                };

                const marker = new AdvancedMarkerElement({
                    map: mapInstanceRef.current,
                    position: position,
                    title: center.centerName || 'Adoption Center'
                });
                markersRef.current.push(marker);
            }

            markersCreatedRef.current = true;
        } catch (error) {
            console.error('Error updating markers:', error);
        }
    }, [validCenters]);

    // Initialize map when component mounts and libraries are loaded
    useEffect(() => {
        if (isLoaded && !mapInstanceRef.current) {
            initMap();
        }
    }, [isLoaded, initMap]);

    // Update markers whenever centers change or map is initialized
    useEffect(() => {
        if (mapInstanceRef.current) {
            updateMarkers();
        }
    }, [updateMarkers, mapInstanceRef.current]);

    // Modify geocodeAddress to update marker position
    const geocodeAddress = async (address) => {
        if (!window.google) return;

        const geocoder = new window.google.maps.Geocoder();

        try {
            const result = await geocoder.geocode({ address });
            if (result.results[0]) {
                const location = result.results[0].geometry.location;
                const position = {
                    lat: location.lat(),
                    lng: location.lng()
                };

                // Update map center and zoom
                mapInstanceRef.current.setCenter(position);
                mapInstanceRef.current.setZoom(14);

                // Update marker position
                const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

                // Clear existing markers
                markersRef.current.forEach(marker => {
                    if (marker) marker.map = null;
                });
                markersRef.current = [];

                // Create new marker at geocoded location
                const marker = new AdvancedMarkerElement({
                    map: mapInstanceRef.current,
                    position: position,
                    title: 'Adoption Center'
                });
                markersRef.current.push(marker);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    };

    // Modify useImperativeHandle to expose both methods
    useImperativeHandle(ref, () => ({
        zoomToCenter: (center) => {
            if (!mapInstanceRef.current || !center?.latitude || !center?.longitude) return;

            const position = {
                lat: parseFloat(center.latitude),
                lng: parseFloat(center.longitude)
            };

            mapInstanceRef.current.setCenter(position);
            mapInstanceRef.current.setZoom(14);
        },
        zoomToAddress: (address) => {
            if (!address) return;
            geocodeAddress(address);
        }
    }));

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps...</div>;

    return <div ref={mapRef} style={mapStyles} />;
});

export default MapComponent;