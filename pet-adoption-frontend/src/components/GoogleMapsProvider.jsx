import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GoogleMapsContext = createContext();

// Define libraries array outside component to prevent recreation on each render
const libraries = ['places'];

// Map configuration
const MAP_ID = 'b181cac70f27f5e6'; // Your unique Map ID from Google Cloud Console

export const GoogleMapsProvider = ({ children }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyCJDrYP6QLJQMz98mGI9pK0w_HZD-1e2B0',
        libraries,
    });

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    return (
        <GoogleMapsContext.Provider value={{ isLoaded, loadError, mapId: MAP_ID }}>
            {children}
        </GoogleMapsContext.Provider>
    );
};

export const useGoogleMaps = () => {
    const context = useContext(GoogleMapsContext);
    if (context === undefined) {
        throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
    }
    return context;
};