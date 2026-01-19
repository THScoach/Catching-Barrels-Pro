export interface SequenceResult {
    correct: boolean;
    order: string[]; // e.g. ['pelvis', 'torso', 'arms', 'bat']
    peaks: {
        pelvis: number; // time (0-1 scale or frame index)
        torso: number;
        arms: number;
        bat: number;
    };
    peakValues: {
        pelvis: number;
        torso: number;
        arms: number;
        bat: number;
    };
    gaps: {
        pelvisToTorso: number;
        torsoToArms: number;
        armsToBat: number;
    };
    score: number; // 0-100 based on efficiency
}

/**
 * Analyzes the kinematic sequence based on angular velocities.
 * Standard Sequence: Pelvis -> Torso -> Arms -> Bat
 */
export function calculateKinematicSequence(
    velocities: Record<string, number[]>
): SequenceResult {
    const segments = ['pelvis', 'torso', 'arms', 'bat'];
    const peaks: Record<string, number> = {};
    const peakValues: Record<string, number> = {};

    // 1. Find Peak Velocities
    segments.forEach(segment => {
        const data = velocities[segment];
        if (!data || data.length === 0) {
            peaks[segment] = 0;
            peakValues[segment] = 0;
            return;
        }

        let maxVal = -Infinity;
        let maxIdx = 0;

        // Find global max
        for (let i = 0; i < data.length; i++) {
            if (data[i] > maxVal) {
                maxVal = data[i];
                maxIdx = i;
            }
        }

        peaks[segment] = maxIdx;
        peakValues[segment] = maxVal;
    });

    // 2. Determine Order
    // Sort segments by peak time
    const sortedSegments = [...segments].sort((a, b) => peaks[a] - peaks[b]);

    // 3. Check Correctness
    // Strict check: Pelvis < Torso < Arms < Bat
    // We allow some tolerance or simultaneous peaks, but generally strict order is preferred.
    let correct = true;
    if (peaks['pelvis'] > peaks['torso']) correct = false;
    if (peaks['torso'] > peaks['arms']) correct = false;
    if (peaks['arms'] > peaks['bat']) correct = false;

    // 4. Calculate Gaps (in frames)
    const gaps = {
        pelvisToTorso: peaks['torso'] - peaks['pelvis'],
        torsoToArms: peaks['arms'] - peaks['torso'],
        armsToBat: peaks['bat'] - peaks['arms']
    };

    // 5. Calculate Score
    // Base score 100
    // Deduct for out of order
    // Deduct for too small or too large gaps
    let score = 100;

    if (!correct) score -= 40;

    // Ideal gap is roughly 10-30ms? In frames (at 30fps), it's small.
    // At 240fps, a 20ms gap is ~5 frames.
    // We'll just penalize negative gaps heavily (already covered by !correct)
    // and penalize very large gaps (inefficient energy transfer).

    // Simple penalty for now
    if (gaps.pelvisToTorso < 0) score -= 10;
    if (gaps.torsoToArms < 0) score -= 10;
    if (gaps.armsToBat < 0) score -= 10;

    return {
        correct,
        order: sortedSegments,
        peaks: {
            pelvis: peaks['pelvis'],
            torso: peaks['torso'],
            arms: peaks['arms'],
            bat: peaks['bat']
        },
        peakValues: {
            pelvis: peakValues['pelvis'],
            torso: peakValues['torso'],
            arms: peakValues['arms'],
            bat: peakValues['bat']
        },
        gaps,
        score: Math.max(0, score)
    };
}
