import React, { useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useGoogleMaps } from './GoogleMapsProvider';

const MapComponent = forwardRef(({ centers }, ref) => {
    const { isLoaded, loadError, mapId } = useGoogleMaps();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

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

    const initMap = useCallback(async () => {
        if (!window.google || !mapRef.current || !validCenters.length || mapInstanceRef.current) return;

        try {
            // Load required libraries
            const { Map } = await window.google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

            // Create the map instance
            const mapInstance = new Map(mapRef.current, {
                zoom: validCenters.length === 1 ? 13 : 4,
                center: defaultCenter,
                mapId: mapId,
                disableDefaultUI: false,
                clickableIcons: false,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
            });

            mapInstanceRef.current = mapInstance;

            // Create markers for each valid center
            for (const center of validCenters) {
                const position = {
                    lat: parseFloat(center.latitude),
                    lng: parseFloat(center.longitude)
                };

                const marker = new AdvancedMarkerElement({
                    map: mapInstance,
                    position: position,
                    title: center.centerName || 'Adoption Center'
                });
                markersRef.current.push(marker);
            }
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }, [validCenters, mapId, defaultCenter]);

    // Initialize map when component mounts and libraries are loaded
    useEffect(() => {
        if (isLoaded && !mapInstanceRef.current) {
            initMap();
        }
    }, [isLoaded, initMap]);

    // Cleanup when component unmounts
    useEffect(() => {
        return () => {
            markersRef.current.forEach(marker => {
                if (marker) marker.map = null;
            });
            markersRef.current = [];
            mapInstanceRef.current = null;
        };
    }, []);

    // Expose zoomToCenter method through ref
    useImperativeHandle(ref, () => ({
        zoomToCenter: (center) => {
            if (!mapInstanceRef.current || !center?.latitude || !center?.longitude) return;

            const position = {
                lat: parseFloat(center.latitude),
                lng: parseFloat(center.longitude)
            };

            mapInstanceRef.current.setCenter(position);
            mapInstanceRef.current.setZoom(15);
        }
    }));

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps...</div>;

    return <div ref={mapRef} style={mapStyles} />;
});

export default MapComponent;