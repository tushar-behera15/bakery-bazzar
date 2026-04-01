"use client";

import { useState, useEffect, useCallback } from "react";
import { calculateDistance } from "@/utils/geo";

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    loading: boolean;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: true,
    });

    const [refreshId, setRefreshId] = useState(0);

    const refresh = useCallback(() => setRefreshId(prev => prev + 1), []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setState(s => ({
                ...s,
                error: "Geolocation is not supported by your browser",
                loading: false,
            }));
            return;
        }

        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        };

        const onSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude, accuracy } = position.coords;
            
            console.log(`Geolocation Update: ${latitude}, ${longitude} (±${accuracy}m)`);

            setState(prev => {
                // Initial update if we don't have location yet
                if (prev.latitude === null || prev.longitude === null) {
                    return { latitude, longitude, accuracy, error: null, loading: false };
                }

                // If the new position is significantly more accurate, always update
                if (prev.accuracy !== null && accuracy < prev.accuracy * 0.5) {
                    return { latitude, longitude, accuracy, error: null, loading: false };
                }

                // Calculate actual distance moved in km
                const distanceKm = calculateDistance(prev.latitude, prev.longitude, latitude, longitude);
                
                // Only update if movement > 30 meters (0.03 km) to avoid request overwhelm due to GPS jitter
                if (distanceKm < 0.03) {
                    return prev;
                }

                return {
                    latitude,
                    longitude,
                    accuracy,
                    error: null,
                    loading: false,
                };
            });
        };

        const onError = (error: GeolocationPositionError) => {
            console.warn("Geolocation Error:", error.message);
            // If it's a timeout, we don't want to set loading to false yet, 
            // as watchPosition will keep trying.
            const isTimeout = error.code === error.TIMEOUT;
            setState(s => ({
                ...s,
                error: error.message,
                loading: isTimeout ? s.loading : false,
            }));
        };

        const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

        return () => navigator.geolocation.clearWatch(watchId);
    }, [refreshId]);

    return { ...state, refreshId, refresh };
};
