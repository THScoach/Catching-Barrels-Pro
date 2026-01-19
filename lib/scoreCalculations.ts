import { SwingMetrics, SensorSwing } from "@prisma/client";

export interface CalculatedScores {
    barrelScore: number | null;
    groundScore: number | null;
    coreScore: number | null;
    whipScore: number | null;
    overallScore: number | null;
}

// === CONSTANTS FOR FREEMAN STANDARD ===
const FREEMAN_EFFICIENCY_TARGET = 1.30; // 1.30x efficiency ratio
const MAX_BAT_SPEED_TARGET = 85.0; // mph for 80 grade (simplified)

export function calculateScores(metrics: Partial<SwingMetrics>): CalculatedScores {
    // Helper to safely get a number or 0
    const val = (v: number | null | undefined) => (v === null || v === undefined ? 0 : v);

    // --- BARREL SCORE (Contact Quality & Launch) ---
    // Key Driver: Sweet Spot & Squared Up
    let barrelScore: number | null = null;
    if (metrics.barrelRate != null || metrics.sweetSpotRate != null) {
        barrelScore = val(metrics.hardHitRate) * 0.4 + val(metrics.sweetSpotRate) * 0.6;
    }

    // --- GROUND SCORE (Force Production) ---
    // Key Driver: Pelvic Velocity & Ground Force (Proxied by Weight Transfer)
    let groundScore: number | null = null;
    if (metrics.pelvicAngularVelocity != null || metrics.weightTransfer != null) {
        // Normalize 300-700 deg/s to 0-100 (approx)
        const pelvicScore = Math.min(100, Math.max(0, (val(metrics.pelvicAngularVelocity) - 300) / 4));
        groundScore = pelvicScore * 0.6 + val(metrics.weightTransfer) * 0.4;
    }

    // --- CORE SCORE (Sequence & Connection) ---
    // Key Driver: Kinematic Sequence & Connection
    let coreScore: number | null = null;
    if (metrics.torsoAngularVelocity != null || metrics.connectionAtImpact != null) {
        // Normalize 0-100 assumption
        coreScore = val(metrics.onPlaneEfficiency) * 0.5 + val(metrics.connectionAtImpact) * 0.5;
    }

    // --- WHIP SCORE (Speed & Transmission) ---
    // Key Driver: Bat Speed & Efficiency
    let whipScore: number | null = null;
    if (metrics.peakBatSpeed != null || metrics.timeToContact != null) {
        // Normalize Bat Speed (50mph = 0, 85mph = 100)
        let speedScore = Math.min(100, Math.max(0, (val(metrics.peakBatSpeed) - 50) * 2.85));
        whipScore = speedScore * 0.7 + (100 - val(metrics.timeToContact) * 1000 * 0.3) * 0.3; // rudimentary calc
    }

    // --- OVERALL SCORE ---
    let overallScore: number | null = null;
    const scores = [barrelScore, groundScore, coreScore, whipScore].filter(
        (s) => s !== null
    ) as number[];

    if (scores.length > 0) {
        overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    return {
        barrelScore: barrelScore !== null ? Math.round(barrelScore) : null,
        groundScore: groundScore !== null ? Math.round(groundScore) : null,
        coreScore: coreScore !== null ? Math.round(coreScore) : null,
        whipScore: whipScore !== null ? Math.round(whipScore) : null,
        overallScore: overallScore !== null ? Math.round(overallScore) : null,
    };
}

// === NEW: KINETIC FINGERPRINT CALCULATIONS (FREEMAN ENGINE) ===
export function calculateKineticFingerprint(
    sensorData: Partial<SensorSwing>,
    exitVelocity?: number // Passed from Ball data if available
) {
    // 1. Calculate Freeman Efficiency Ratio
    // Formula: Exit Velocity / Bat Speed
    // Benchmark: 1.30x (Elite)
    let freemanRatio = 0;
    if (exitVelocity && sensorData.batSpeedMph) {
        freemanRatio = exitVelocity / sensorData.batSpeedMph;
    }

    // 2. Calculate Kinetic Chain Efficiency
    // Formula: Bat KE / Legs KE
    // Placeholder conversion: Bat KE needs Mass. Using standard 31oz (0.88kg).
    // KE = 0.5 * m * v^2
    let kineticChainEfficiency = 0;
    if (sensorData.legsKw && sensorData.batSpeedMph) {
        // Convert mph to m/s
        const batSpeedMs = sensorData.batSpeedMph * 0.44704;
        const batMassKg = 0.88;
        const batJ = 0.5 * batMassKg * Math.pow(batSpeedMs, 2);
        // Assuming legsKw is actually J or comparable unit from Reboot
        // If it's truly kW (power), we need duration. Assuming Reboot sends 'Energy' in J for this calc.
        kineticChainEfficiency = batJ / sensorData.legsKw;
    }

    // 3. B4 Bucket (Temporal Sync)
    // Formula: B4 = 1 - (stdDev / 0.3)
    // We need normalized peak frames for segments to calc stdDev.
    let b4SyncScore = 0.5; // Default reference
    const times = [
        sensorData.legsKEPeakTime,
        sensorData.torsoKEPeakTime,
        sensorData.armsKEPeakTime
    ].filter(t => t !== null && t !== undefined) as number[];

    if (times.length >= 3) {
        // Calculate StdDev of the peak times (assuming they are normalized or close)
        const mean = times.reduce((a, b) => a + b, 0) / times.length;
        const variance = times.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / times.length;
        const stdDev = Math.sqrt(variance);
        b4SyncScore = Math.max(0, 1 - (stdDev / 0.3));
    }

    // 4. Energy Leak Detection (Coach Rick Voice)
    // Automated feedback strings based on timing errors
    const energyLeaks: string[] = [];

    // We assume times are relative to contact (0.0) OR we have a contactFrame. 
    // If we use relative seconds: negative is before contact, 0 is contact.
    // Let's assume input is in SECONDS relative to contact for these logic checks.

    const LEGS_TIME = sensorData.legsKEPeakTime ?? -999;
    const TORSO_TIME = sensorData.torsoKEPeakTime ?? -999;
    const ARMS_TIME = sensorData.armsKEPeakTime ?? -999;
    const CONTACT_TIME = 0.0; // Reference if normalized

    // LATE_LEGS: If legs fire after hands (arms) or after contact
    if (LEGS_TIME > CONTACT_TIME || LEGS_TIME > ARMS_TIME) {
        energyLeaks.push("LATE_LEGS");
    }

    // EARLY_ARMS: If arms take over before legs finish (Arms before Torso is a strong signal)
    if (ARMS_TIME < TORSO_TIME) {
        energyLeaks.push("EARLY_ARMS");
    }

    // TORSO_BYPASS: Energy jumps from legs to arms skipping core (Less than 3ms delay)
    // 3ms = 0.003s
    if (Math.abs(ARMS_TIME - LEGS_TIME) < 0.003 && ARMS_TIME > LEGS_TIME) {
        energyLeaks.push("TORSO_BYPASS");
    }

    // NO_BAT_DELIVERY: Low Kinetic Chain Efficiency (< 0.9)
    if (kineticChainEfficiency < 0.9) {
        energyLeaks.push("NO_BAT_DELIVERY");
    }

    // CLEAN_TRANSFER: Trigger if all segments peak in the correct order (Legs -> Torso -> Arms) with a > 1.2 efficiency ratio.
    if (LEGS_TIME < TORSO_TIME && TORSO_TIME < ARMS_TIME && kineticChainEfficiency > 1.2) {
        energyLeaks.push("CLEAN_TRANSFER");
    }

    // 5. 20-80 Scoring Scale Normalization
    // Helper to map a value to 20-80 scale given min/max range
    const scale2080 = (val: number, min: number, max: number) => {
        const clamped = Math.min(max, Math.max(min, val));
        const normalized = (clamped - min) / (max - min); // 0-1
        return 20 + (normalized * 60); // 20-80
    };

    const scores = {
        batScore: scale2080(sensorData.batSpeedMph || 0, 50, 85),
        bodyScore: scale2080(kineticChainEfficiency, 0.5, 2.0),
        brainScore: scale2080(freemanRatio, 1.0, 1.40), // 1.0 = poor, 1.4 = god tier
        ballScore: scale2080(exitVelocity || 0, 60, 105)
    };

    // Weighted Average for Overall Fingerprint
    const overallFingerprint = (scores.batScore + scores.bodyScore + scores.brainScore + scores.ballScore) / 4;

    return {
        freemanRatio: parseFloat(freemanRatio.toFixed(2)),
        kineticChainEfficiency: parseFloat(kineticChainEfficiency.toFixed(2)),
        scores: {
            batScore: Math.round(scores.batScore),
            bodyScore: Math.round(scores.bodyScore),
            brainScore: Math.round(scores.brainScore),
            ballScore: Math.round(scores.ballScore),
            overallFingerprint: Math.round(overallFingerprint)
        },
        energyLeaks // Return the array
    };
}

export function calculateLessonScores(swings: any[]) {
    // ... existing logic can remain or use the new helper
    if (!swings || swings.length === 0) {
        return {
            overallScore: 0,
            barrelScore: 0,
            groundScore: 0,
            coreScore: 0,
            whipScore: 0,
            avgExitVelo: 0,
            avgBatSpeed: 0,
            avgLaunchAngle: 0,
        };
    }

    let totalOverall = 0;
    let totalBarrel = 0;
    let totalGround = 0;
    let totalCore = 0;
    let totalWhip = 0;
    let totalExitVelo = 0;
    let totalBatSpeed = 0;
    let totalLaunchAngle = 0;
    let count = 0;

    swings.forEach((swing) => {
        if (swing.swingMetrics) {
            totalOverall += swing.swingMetrics.overallScore || 0;
            totalBarrel += swing.swingMetrics.barrelScore || 0;
            totalGround += swing.swingMetrics.groundScore || 0;
            totalCore += swing.swingMetrics.coreScore || 0;
            totalWhip += swing.swingMetrics.whipScore || 0;
            totalExitVelo += swing.swingMetrics.exitVelocity || 0;
            totalBatSpeed += swing.swingMetrics.batSpeed || 0;
            totalLaunchAngle += swing.swingMetrics.launchAngle || 0;
            count++;
        }
    });

    if (count === 0) return {
        overallScore: 0,
        barrelScore: 0,
        groundScore: 0,
        coreScore: 0,
        whipScore: 0,
        avgExitVelo: 0,
        avgBatSpeed: 0,
        avgLaunchAngle: 0,
    };

    return {
        overallScore: totalOverall / count,
        barrelScore: totalBarrel / count,
        groundScore: totalGround / count,
        coreScore: totalCore / count,
        whipScore: totalWhip / count,
        avgExitVelo: totalExitVelo / count,
        avgBatSpeed: totalBatSpeed / count,
        avgLaunchAngle: totalLaunchAngle / count,
    };
}
