// src/components/hospitals/ui/hospital-profile/HospitalLocationSection.tsx

"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    ZoomControl,
    ScaleControl,
    Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateHospital } from "@/hooks/useUpdateHospital";
import { Role } from "@/lib/definitions";

interface HospitalMapProps {
    hospitalId: number;
    latitude?: number | null;
    longitude?: number | null;
    hospitalName: string;
    userRole?: Role;
}

export default function HospitalMap({
    hospitalId,
    latitude,
    longitude,
    hospitalName,
    userRole,
}: HospitalMapProps) {
    // const userRole = role;
    const { toast } = useToast();
    const updateHospitalMutation = useUpdateHospital();

    // Fix marker icon paths
    useEffect(() => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
    }, []);

    // State for current position, edit mode, and undo
    const [position, setPosition] = useState<[number, number] | null>(
        latitude != null && longitude != null ? [latitude, longitude] : null
    );
    const prevPositionRef = useRef<[number, number] | null>(position);
    const [isEditMode, setIsEditMode] = useState(false);
    const [lastPosition, setLastPosition] = useState<[number, number] | null>(
        null
    );

    // Handle drag end: optimistic update + rollback + enable undo
    const onDragEnd = useCallback(
        (e: any) => {
            if (!position) return;
            prevPositionRef.current = position;
            const { lat, lng } = e.target.getLatLng();

            setPosition([lat, lng]);
            setIsEditMode(false);

            updateHospitalMutation.mutate(
                { hospitalId, data: { latitude: lat, longitude: lng } },
                {
                    onSuccess: () => {
                        // Store old coords to allow undo
                        if (prevPositionRef.current) {
                            setLastPosition(prevPositionRef.current);
                        }
                        toast({
                            title: "Location updated",
                            description: `New coordinates: (${lat.toFixed(
                                5
                            )}, ${lng.toFixed(5)})`,
                        });
                    },
                    onError: () => {
                        if (prevPositionRef.current) {
                            setPosition(prevPositionRef.current);
                        }
                        toast({
                            title: "Error",
                            description: "Could not save new location.",
                            variant: "destructive",
                        });
                    },
                }
            );
        },
        [hospitalId, position, toast, updateHospitalMutation]
    );

    // Undo handler: revert to lastPosition
    const onUndo = useCallback(() => {
        if (!lastPosition) return;
        const [lat, lng] = lastPosition;

        // Optimistically revert
        setPosition([lat, lng]);

        updateHospitalMutation.mutate(
            { hospitalId, data: { latitude: lat, longitude: lng } },
            {
                onSuccess: () => {
                    toast({
                        title: "Reverted",
                        description: `Location restored to previous coordinates.`,
                    });
                    setLastPosition(null);
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Could not revert location.",
                        variant: "destructive",
                    });
                    // If revert fails, do not clear lastPosition
                },
            }
        );
    }, [hospitalId, lastPosition, toast, updateHospitalMutation]);

    if (position === null) {
        return (
            <div className="flex items-center justify-center h-full bg-black/5 rounded-[10px] p-4">
                <p className="text-center">
                    No coordinates available for this hospital.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-[10px] overflow-hidden bg-white shadow-md flex flex-col">
            <div className="flex flex-row justify-between items-center bg-bluelight rounded-t-[10px] mb-4 p-4">
                <span className="text-lg font-semibold whitespace-nowrap">
                    Hospital Location
                </span>
                {userRole === "SUPER_ADMIN" && (
                    <div className=" flex justify-end gap-2 p-1">
                        <Button
                            size="sm"
                            className={`rounded-[10px] whitespace-nowrap ${
                                isEditMode
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-primary hover:bg-primary/70 text-white"
                            }`}
                            onClick={() => setIsEditMode((prev) => !prev)}
                        >
                            {isEditMode ? "Cancel Edit" : "Edit Location"}
                        </Button>
                        {lastPosition && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-[10px] bg-primary text-white hover:bg-primary/70"
                                onClick={onUndo}
                            >
                                Undo
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <div className="flex-1 rounded-[10px] overflow-hidden p-1 relative z-[20]">
                {/* Hospital name overlay */}
                <div className="absolute top-8 left-8 z-[1000] bg-white/90 px-3 py-1 rounded-[8px] shadow text-sm font-semibold text-gray-800">
                    {hospitalName}
                </div>

                <MapContainer
                    center={position}
                    zoom={16}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    className="h-full w-full rounded-[10px]"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={position}
                        draggable={isEditMode}
                        eventHandlers={
                            isEditMode ? { dragend: onDragEnd } : undefined
                        }
                    >
                        <Popup>
                            <div className="text-left p-1">
                                <strong className="mb-2">{hospitalName}</strong>
                                <br />
                                <span>Latitude: {position[0].toFixed(5)}</span>
                                <br />
                                <span>Longitude: {position[1].toFixed(5)}</span>
                            </div>
                        </Popup>
                    </Marker>
                    <ZoomControl position="topright" />
                    <ScaleControl position="bottomleft" />
                    <Circle
                        center={position}
                        radius={200}
                        pathOptions={{ color: "blue", fillOpacity: 0.1 }}
                    />
                </MapContainer>
            </div>
        </div>
    );
}
