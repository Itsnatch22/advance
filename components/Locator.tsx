"use client"
import { useState, useEffect } from "react"

export default function Locator() {
    const [ coords, setCoords ] = useState<{ lat: number ; long: number} | null>(null);

    useEffect(() => {
        if("geolocation" in navigator ){
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCoords ({
                        lat: pos.coords.latitude,
                        long: pos.coords.longitude,
                    });
                },
                (err) => console.warn("Geo permission denied", err),
            )
        }
    }, []);

    return(
        <div className="text-xs text-gray-500 dark:text-gray-400 justify-center items-center py-3">
            {coords ? (
                <span>
                    🌍Lat: {coords.lat.toFixed(4)} | Long: {coords.long.toFixed(4)}
                </span>
            ) : (
                <span className="animate-pulse">📍 Locating...</span>
            )}
        </div>

    )
}