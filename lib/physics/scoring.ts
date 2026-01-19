import { BiomechanicsResult } from './types';

// MLB Averages (Mean, StdDev)
// Source: Aggregated from public biomechanics data (Kwon, Reboot, etc.)
const MLB_AVERAGES = {
    pelvisAngularVelocity: { mean: 580, std: 60 }, // deg/s
    torsoAngularVelocity: { mean: 820, std: 70 }, // deg/s
    armAngularVelocity: { mean: 1100, std: 100 }, // deg/s (Lead arm)
    batAngularVelocity: { mean: 2650, std: 150 }, // deg/s
    xFactor: { mean: 38, std: 8 }, // degrees
    hipSeparation: { mean: 45, std: 5 }, // degrees
    shoulderSeparation: { mean: 90, std: 10 }, // degrees
    headDrift: { mean: 0.05, std: 0.02 }, // meters (lower is better)
    spineStability: { mean: 5, std: 2 } // degrees variance (lower is better)
};

export interface FlowScores {
    anchor: number;
    core: number; // "Engine"
    whip: number; // "Weapon"
    overall: number;
    details: {
        anchor: { pelvisVelocity: number; stability: number; rom: number };
        core: { torsoVelocity: number; xFactor: number; sequence: number };
        whip: { batVelocity: number; armVelocity: number; stability: number };
    };
}

/**
 * Calculates Flow Scores (Anchor, Core, Whip) based on biomechanics data.
 * Scores are normalized to 0-10.
 */
export function calculateFlowScores(
    metrics: {
        peakVelocities: { pelvis: number; torso: number; arms: number; bat: number };
        stability: { headDrift: number; spineAngleStability: number };
        rom: { hipSeparation: number; xFactor: number; rangeNorm: number };
        sequence: { score: number };
    }
): FlowScores {
    // Helper to calculate score (0-10) from value, mean, std
    // Higher is better
    const scoreMetric = (value: number, mean: number, std: number, weight: number = 1.0) => {
        const z = (value - mean) / std;
        // Map Z-score (-3 to +3) to 0-10
        // Z=0 -> 7.5 (Average MLB is a solid score)
        // Z=-2 -> 2.5
        // Z=+2 -> 10 (Elite)
        let score = 7.5 + (z * 1.25);
        return Math.max(0, Math.min(10, score)) * weight;
    };

    // Helper for "Lower is Better" metrics (Stability)
    const scoreInverseMetric = (value: number, mean: number, std: number, weight: number = 1.0) => {
        const z = (mean - value) / std; // Invert Z
        let score = 7.5 + (z * 1.25);
        return Math.max(0, Math.min(10, score)) * weight;
    };

    // Convert rad/s to deg/s for comparison
    const radToDeg = (rad: number) => rad * (180 / Math.PI);
    const pelvisDeg = radToDeg(metrics.peakVelocities.pelvis);
    const torsoDeg = radToDeg(metrics.peakVelocities.torso);
    const armDeg = radToDeg(metrics.peakVelocities.arms);
    const batDeg = radToDeg(metrics.peakVelocities.bat);

    // 1. ANCHOR SCORE (Foundation)
    // Components: Pelvis Velocity (40%), Hip ROM (30%), Stability (30%)
    const anchorPelvis = scoreMetric(pelvisDeg, MLB_AVERAGES.pelvisAngularVelocity.mean, MLB_AVERAGES.pelvisAngularVelocity.std);
    const anchorRom = scoreMetric(metrics.rom.hipSeparation, MLB_AVERAGES.hipSeparation.mean, MLB_AVERAGES.hipSeparation.std);
    // Stability: Combine Head Drift and Spine Stability
    const anchorStability = (
        scoreInverseMetric(metrics.stability.headDrift, MLB_AVERAGES.headDrift.mean, MLB_AVERAGES.headDrift.std) +
        scoreInverseMetric(metrics.stability.spineAngleStability, MLB_AVERAGES.spineStability.mean, MLB_AVERAGES.spineStability.std)
    ) / 2;

    const anchorScore = (anchorPelvis * 0.4) + (anchorRom * 0.3) + (anchorStability * 0.3);

    // 2. CORE SCORE (Engine)
    // Components: Torso Velocity (40%), X-Factor (30%), Sequence (30%)
    const coreTorso = scoreMetric(torsoDeg, MLB_AVERAGES.torsoAngularVelocity.mean, MLB_AVERAGES.torsoAngularVelocity.std);
    const coreXFactor = scoreMetric(metrics.rom.xFactor, MLB_AVERAGES.xFactor.mean, MLB_AVERAGES.xFactor.std);
    // Sequence score is already 0-100, map to 0-10
    const coreSequence = metrics.sequence.score / 10;

    const coreScore = (coreTorso * 0.4) + (coreXFactor * 0.3) + (coreSequence * 0.3);

    // 3. WHIP SCORE (Weapon)
    // Components: Bat Velocity (50%), Arm Velocity (30%), Head Stability (20%)
    const whipBat = scoreMetric(batDeg, MLB_AVERAGES.batAngularVelocity.mean, MLB_AVERAGES.batAngularVelocity.std);
    const whipArm = scoreMetric(armDeg, MLB_AVERAGES.armAngularVelocity.mean, MLB_AVERAGES.armAngularVelocity.std);
    const whipStability = scoreInverseMetric(metrics.stability.headDrift, MLB_AVERAGES.headDrift.mean, MLB_AVERAGES.headDrift.std);

    const whipScore = (whipBat * 0.5) + (whipArm * 0.3) + (whipStability * 0.2);

    // 4. OVERALL SCORE
    // Weighted: Anchor 30%, Core 35%, Whip 35%
    const overallScore = (anchorScore * 0.30) + (coreScore * 0.35) + (whipScore * 0.35);

    return {
        anchor: Number(anchorScore.toFixed(1)),
        core: Number(coreScore.toFixed(1)),
        whip: Number(whipScore.toFixed(1)),
        overall: Number(overallScore.toFixed(1)),
        details: {
            anchor: { pelvisVelocity: anchorPelvis, stability: anchorStability, rom: anchorRom },
            core: { torsoVelocity: coreTorso, xFactor: coreXFactor, sequence: coreSequence },
            whip: { batVelocity: whipBat, armVelocity: whipArm, stability: whipStability }
        }
    };
}
