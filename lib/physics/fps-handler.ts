import { Pose } from './types';

export interface VideoQuality {
    fps: number;
    tier: 'elite' | 'professional' | 'standard' | 'insufficient';
    confidence: 'very_high' | 'high' | 'medium' | 'low';
    description: string;
}

/**
 * Detects frame rate from pose timestamps.
 * Assumes timestamps are in seconds.
 */
export function detectFrameRate(poses: Pose[]): number {
    if (!poses || poses.length < 2) return 30; // Default fallback

    // Calculate intervals between frames
    const intervals: number[] = [];
    for (let i = 1; i < poses.length; i++) {
        const dt = poses[i].timestamp - poses[i - 1].timestamp;
        if (dt > 0) intervals.push(dt);
    }

    if (intervals.length === 0) return 30;

    // Calculate mean interval
    const sum = intervals.reduce((a, b) => a + b, 0);
    const avgInterval = sum / intervals.length;

    // Convert to FPS
    const fps = 1 / avgInterval;

    // Round to nearest common frame rate
    if (Math.abs(fps - 600) < 50) return 600;
    if (Math.abs(fps - 480) < 40) return 480;
    if (Math.abs(fps - 240) < 20) return 240;
    if (Math.abs(fps - 120) < 10) return 120;
    if (Math.abs(fps - 60) < 5) return 60;
    if (Math.abs(fps - 30) < 5) return 30;

    return Math.round(fps);
}

/**
 * Assesses video quality based on FPS.
 */
export function assessVideoQuality(fps: number): VideoQuality {
    if (fps >= 480) {
        return {
            fps,
            tier: 'elite',
            confidence: 'very_high',
            description: 'Ultra-high-speed capture (Elite)'
        };
    }
    if (fps >= 240) {
        return {
            fps,
            tier: 'professional',
            confidence: 'high',
            description: 'High-speed capture (Professional)'
        };
    }
    if (fps >= 120) {
        return {
            fps,
            tier: 'standard',
            confidence: 'medium',
            description: 'Standard high-speed (Standard)'
        };
    }
    return {
        fps,
        tier: 'insufficient',
        confidence: 'low',
        description: 'Below minimum threshold for accurate analysis'
    };
}

/**
 * Calculates optimal smoothing window size based on FPS.
 * Target window is ~22ms.
 */
export function calculateSmoothingWindow(fps: number): number {
    const targetWindowTime = 0.022; // 22ms
    let windowFrames = Math.round(targetWindowTime * fps);

    // Ensure odd number for centered smoothing
    if (windowFrames % 2 === 0) windowFrames += 1;

    return Math.max(3, windowFrames); // Minimum 3 frames
}
