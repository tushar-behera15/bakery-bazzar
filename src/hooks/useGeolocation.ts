"use client";

import { useState, useEffect, useCallback } from "react";

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
            timeout: 10000,
            maximumAge: 0,
        };

        const onSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude, accuracy } = position.coords;
            
            console.log(`Geolocation Update: ${latitude}, ${longitude} (±${accuracy}m)`);

            setState(prev => {
                // If the new position is significantly more accurate, always update
                if (prev.accuracy !== null && accuracy < prev.accuracy * 0.5) {
                    return { latitude, longitude, accuracy, error: null, loading: false };
                }

                // Normal movement check
                if (prev.latitude !== null && prev.longitude !== null) {
                    const dLat = Math.abs(prev.latitude - latitude);
                    const dLng = Math.abs(prev.longitude - longitude);
                    if (dLat < 0.00001 && dLng < 0.00001) {
                        return prev;
                    }
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
            setState(s => ({
                ...s,
                error: error.message,
                loading: false,
            }));
        };

        const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

        return () => navigator.geolocation.clearWatch(watchId);
    }, [refreshId]);

    return { ...state, refreshId, refresh };
};
