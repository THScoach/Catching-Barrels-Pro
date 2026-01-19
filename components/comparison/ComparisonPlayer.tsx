"use client";

import { useState, useRef, useEffect } from "react";

export function ComparisonPlayer({ video1, video2 }: { video1?: string; video2?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    const video1Ref = useRef<HTMLVideoElement>(null);
    const video2Ref = useRef<HTMLVideoElement>(null);

    // Sync video playback
    const syncVideos = () => {
        if (video1Ref.current && video2Ref.current) {
            if (Math.abs(video2Ref.current.currentTime - video1Ref.current.currentTime) > 0.1) {
                video2Ref.current.currentTime = video1Ref.current.currentTime;
            }
        }
    };

    const togglePlay = () => {
        if (video1Ref.current && video2Ref.current) {
            if (isPlaying) {
                video1Ref.current.pause();
                video2Ref.current.pause();
            } else {
                video1Ref.current.play();
                video2Ref.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (video1Ref.current) {
            setCurrentTime(video1Ref.current.currentTime);
            syncVideos();
        }
    };

    const changeSpeed = (speed: number) => {
        setPlaybackSpeed(speed);
        if (video1Ref.current && video2Ref.current) {
            video1Ref.current.playbackRate = speed;
            video2Ref.current.playbackRate = speed;
        }
    };

    return (
        <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent mb-6">

            {/* Videos */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Video 1 */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {video1 ? (
                        <>
                            <video
                                ref={video1Ref}
                                src={video1}
                                className="w-full h-full object-contain"
                                onTimeUpdate={handleTimeUpdate}
                                playsInline
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                                Before
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No video available
                        </div>
                    )}
                </div>

                {/* Video 2 */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {video2 ? (
                        <>
                            <video
                                ref={video2Ref}
                                src={video2}
                                className="w-full h-full object-contain"
                                playsInline
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-cb-gold text-cb-dark text-sm rounded-full font-medium">
                                After
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No video available
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
                {/* Play/Pause */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={togglePlay}
                        className="w-16 h-16 bg-cb-gold hover:bg-cb-gold-dark text-cb-dark rounded-full flex items-center justify-center transition-colors"
                    >
                        {isPlaying ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Playback Speed */}
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-400">Speed:</span>
                    {[0.25, 0.5, 0.75, 1].map((speed) => (
                        <button
                            key={speed}
                            onClick={() => changeSpeed(speed)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${playbackSpeed === speed
                                    ? "bg-cb-gold text-cb-dark font-medium"
                                    : "bg-cb-dark text-gray-400 hover:bg-cb-dark-accent"
                                }`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
