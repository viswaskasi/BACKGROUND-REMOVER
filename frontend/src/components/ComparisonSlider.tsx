"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";

interface ComparisonSliderProps {
    originalImage: string;
    processedImage: string;
}

export default function ComparisonSlider({ originalImage, processedImage }: ComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    }, []);

    const onMouseMove = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!isDragging) return;
        handleMove((e as MouseEvent).clientX);
    }, [isDragging, handleMove]);

    const onTouchMove = useCallback((e: TouchEvent | React.TouchEvent) => {
        if (!isDragging) return;
        handleMove((e as TouchEvent).touches[0].clientX);
    }, [isDragging, handleMove]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", () => setIsDragging(false));
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", () => setIsDragging(false));
        } else {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", () => setIsDragging(false));
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", () => setIsDragging(false));
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", () => setIsDragging(false));
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", () => setIsDragging(false));
        };
    }, [isDragging, onMouseMove, onTouchMove]);

    return (
        <div
            className="relative rounded-2xl overflow-hidden select-none group cursor-ew-resize mx-auto shadow-2xl border border-border/50"
            style={{ width: "fit-content" }}
            ref={containerRef}
            onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
                setIsDragging(true);
                handleMove(e.touches[0].clientX);
            }}
        >
            {/* Spacer image to dictate the exact container size based on the image's aspect ratio */}
            <img 
                src={originalImage} 
                className="max-h-[75vh] w-auto max-w-full opacity-0 pointer-events-none block" 
                alt="" 
            />

            {/* Background (Original Image) */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={originalImage}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                />
            </div>

            {/* Foreground (Processed Image) */}
            <div
                className="absolute inset-0 right-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                {/* Solid white background behind the processed image */}
                <div className="absolute inset-0 w-full h-full pointer-events-none bg-white" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={processedImage}
                    alt="Processed"
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                />
            </div>

            {/* Slider Handle */}
            <div
                className="absolute inset-y-0 w-1 bg-white/80 shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize items-center justify-center flex"
                style={{ left: `${sliderPosition}%` }}
            >
                <motion.div
                    className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border border-border transition-transform active:scale-90"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <MoveHorizontal className="w-5 h-5 text-black" />
                </motion.div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Original
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/50 backdrop-blur-sm text-black text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Processed
            </div>
        </div>
    );
}
