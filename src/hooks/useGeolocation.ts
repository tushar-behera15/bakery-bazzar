"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
    
    // Use refs to track values and avoid stale closures in watchPosition
    const lastUpdateRef = useRef<number>(0);
    const coordsRef = useRef<{ lat: number | null; lng: number | null; acc: number | null }>({
        lat: null,
        lng: null,
        acc: null
    });

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
            maximumAge: 10000, // Cache for 10 seconds to reduce frequent hardware wakeups
        };

        const onSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude, accuracy } = position.coords;
            const now = Date.now();
            
            // 1. Throttling: Ignore if less than 2 seconds since last state update
            if (now - lastUpdateRef.current < 2000 && coordsRef.current.lat !== null) {
                return;
            }

            // 2. Initial fix logic
            if (coordsRef.current.lat === null || coordsRef.current.lng === null) {
                lastUpdateRef.current = now;
                coordsRef.current = { lat: latitude, lng: longitude, acc: accuracy };
                setState({ latitude, longitude, accuracy, error: null, loading: false });
                return;
            }

            // 3. Movement evaluation
            const distanceKm = calculateDistance(
                coordsRef.current.lat, 
                coordsRef.current.lng, 
                latitude, 
                longitude
            );
            
            // CRITERIA FOR UPDATE:
            // - Moved more than 50 meters (0.05 km)
            // - OR Moved more than 15 meters AND accuracy improved significantly (>50%)
            const substantialMove = distanceKm >= 0.05;
            const significantAccuracyImprovement = coordsRef.current.acc !== null && accuracy < (coordsRef.current.acc * 0.5);
            const jitterMove = distanceKm >= 0.015;

            if (substantialMove || (significantAccuracyImprovement && jitterMove)) {
                console.log(`Geolocation Updated: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${accuracy}m), Moved: ${(distanceKm * 1000).toFixed(1)}m`);
                
                lastUpdateRef.current = now;
                coordsRef.current = { lat: latitude, lng: longitude, acc: accuracy };
                
                setState({
                    latitude,
                    longitude,
                    accuracy,
                    error: null,
                    loading: false,
                });
            }
        };

        const onError = (error: GeolocationPositionError) => {
            // If it's a timeout, we don't want to set error state as watchPosition will keep trying.
            const isTimeout = error.code === error.TIMEOUT;
            if (!isTimeout) {
                console.warn("Geolocation Error:", error.message);
                setState(s => ({
                    ...s,
                    error: error.message,
                    loading: false,
                }));
            }
        };

        const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

        return () => navigator.geolocation.clearWatch(watchId);
    }, [refreshId]);

    return { ...state, refreshId, refresh };
};
