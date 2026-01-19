import { Pose, AthleteData, BiomechanicsResult, Point3D, StabilityMetrics, ROMMetrics } from './types';
import { calculateSegmentMasses, estimateSegmentDimensions } from './anthropometry';
import { calculateAngularMomentum } from './momentum';
import { calculateAngularVelocities } from './velocity';
import { calculateKinematicSequence } from './sequence';
import { detectFrameRate, assessVideoQuality } from './fps-handler';
import { normalizeTimeSeries, resampleToStandardPoints } from './normalization';
import { calculateFlowScores } from './scoring';

// Main entry point for Biomechanics Analysis
export function analyzeSwingBiomechanics(
    poses: Pose[],
    athleteData: AthleteData
): BiomechanicsResult {
    // 1. Validate Input
    if (!poses || poses.length === 0) {
        throw new Error("No pose data provided");
    }

    // 2. Detect FPS and Quality
    const fps = detectFrameRate(poses);
    const quality = assessVideoQuality(fps);

    // 3. Estimate Dimensions (using first frame)
    const firstPose = poses[0];
    // Convert Joint to Point3D map
    const jointMap: Record<string, Point3D> = {};
    Object.entries(firstPose.joints).forEach(([key, val]) => jointMap[key] = val.position);

    const dimensions = estimateSegmentDimensions(jointMap, athleteData.heightCm);

    // 4. Calculate Velocities (Real Physics with Adaptive Smoothing)
    const velocities = calculateAngularVelocities(poses, fps);

    // Get Peak Velocities for Momentum Calculation
    const peakVelocities = {
        pelvis: Math.max(...velocities.pelvis.map(Math.abs)) || 0,
        torso: Math.max(...velocities.torso.map(Math.abs)) || 0,
        arms: Math.max(...velocities.arms.map(Math.abs)) || 0,
        bat: Math.max(...velocities.bat.map(Math.abs)) || 0
    };

    // 5. Calculate Momentum for Key Segments
    // We assume rotation around the vertical axis passing through the Pelvis Center (or system COM)
    const rotationAxis: Point3D = { x: 0, y: 0, z: 1 };

    // Helper to sum momentum for a group of segments
    const calculateCompositeMomentum = (
        segments: string[],
        angularVelocity: number, // rad/s (assumed shared for the group for now)
        axisOrigin: Point3D // Point the group rotates around
    ) => {
        let totalMomentum = 0;

        segments.forEach(segName => {
            // 1. Local Momentum (Spin)
            // @ts-ignore
            const dims = dimensions[segName] || dimensions['trunk']; // fallback
            const localL = calculateAngularMomentum(segName, angularVelocity, rotationAxis, athleteData, dims);

            // 2. Orbital Momentum (Orbit)
            // Distance from segment COM to Axis Origin
            // We need segment positions. For Phase 1, we'll use Joint positions as proxies for Segment COMs.
            let segPos: Point3D = { x: 0, y: 0, z: 0 };
            if (segName === 'thigh') segPos = jointMap['right_hip'] || jointMap['left_hip']; // simplified
            else if (segName === 'shank') segPos = jointMap['right_knee'] || jointMap['left_knee'];
            else if (segName === 'foot') segPos = jointMap['right_ankle'] || jointMap['left_ankle'];
            else if (segName === 'upperArm') segPos = jointMap['right_shoulder'];
            else if (segName === 'forearm') segPos = jointMap['right_elbow'];
            else if (segName === 'hand') segPos = jointMap['right_wrist'];
            else if (segName === 'head') segPos = jointMap['neck'];

            // Calculate distance to axis (projected on ground plane for vertical rotation)
            const dist = Math.sqrt(
                Math.pow(segPos.x - axisOrigin.x, 2) +
                Math.pow(segPos.y - axisOrigin.y, 2)
            );

            // Get mass
            const masses = calculateSegmentMasses(athleteData.weightKg);
            // @ts-ignore
            const mass = masses[segName] || 0;

            // L_orbital = m * r^2 * w
            const orbitalL = mass * Math.pow(dist, 2) * angularVelocity;

            totalMomentum += localL + orbitalL;
        });

        return totalMomentum;
    };

    // Define Axis Origin (e.g., Mid Hip)
    const axisOrigin = jointMap['mid_hip'] || { x: 0, y: 0, z: 0 };

    // Lower Half: Pelvis + Legs
    const lowerHalfMomentum = calculateCompositeMomentum(
        ['pelvis', 'thigh', 'shank', 'foot', 'thigh', 'shank', 'foot'],
        peakVelocities.pelvis,
        axisOrigin
    );

    // Torso: Trunk + Head
    const torsoMomentum = calculateCompositeMomentum(
        ['trunk', 'head'],
        peakVelocities.torso,
        axisOrigin
    );

    // Arms: Upper + Forearm + Hand (x2)
    const armsMomentum = calculateCompositeMomentum(
        ['upperArm', 'forearm', 'hand', 'upperArm', 'forearm', 'hand'],
        peakVelocities.arms,
        axisOrigin
    );

    // Bat: Bat
    const handPos = jointMap['right_wrist'] || { x: 0, y: 0, z: 0 };
    const batDist = Math.sqrt(Math.pow(handPos.x - axisOrigin.x, 2) + Math.pow(handPos.y - axisOrigin.y, 2)) + 0.4; // approx COM offset
    const batMass = 0.85;
    const batLocalL = calculateAngularMomentum('bat', peakVelocities.bat, rotationAxis, athleteData, dimensions.bat);
    const batOrbitalL = batMass * Math.pow(batDist, 2) * peakVelocities.arms;
    const batMomentum = batLocalL + batOrbitalL;

    // 6. Sequence Analysis
    const sequenceResult = calculateKinematicSequence(velocities);

    // 7. Stability Metrics
    const stability = calculateStability(poses);

    // 8. ROM Metrics
    const rom = calculateROM(poses);

    // 9. Normalization & Resampling
    // Normalize velocities to 0-1 time scale and resample to 100 points
    const normalizedVelocities: Record<string, number[]> = {};
    ['pelvis', 'torso', 'arms', 'bat'].forEach(segment => {
        const normalized = normalizeTimeSeries(velocities[segment]);
        normalizedVelocities[segment] = resampleToStandardPoints(normalized, 100);
    });

    const normalizedMomentum: Record<string, number[]> = {
        pelvis: new Array(100).fill(lowerHalfMomentum),
        torso: new Array(100).fill(torsoMomentum),
        arms: new Array(100).fill(armsMomentum),
        bat: new Array(100).fill(batMomentum)
    };

    // 10. Calculate Flow Scores
    const scores = calculateFlowScores({
        peakVelocities,
        stability,
        rom,
        sequence: { score: sequenceResult.score }
    });

    return {
        quality,
        scores,
        momentum: {
            pelvis: lowerHalfMomentum,
            torso: torsoMomentum,
            arms: armsMomentum,
            bat: batMomentum
        },
        sequence: {
            correct: sequenceResult.correct,
            peaks: sequenceResult.peaks,
            score: sequenceResult.score
        },
        stability,
        rom,
        normalizedData: {
            velocities: normalizedVelocities,
            momentum: normalizedMomentum
        }
    };
}

function calculateStability(poses: Pose[]): StabilityMetrics {
    // 1. Head Drift
    let maxDrift = 0;
    if (poses.length > 0) {
        const firstHead = poses[0].joints['nose']?.position || { x: 0, y: 0, z: 0 };

        for (const pose of poses) {
            const head = pose.joints['nose']?.position;
            if (head) {
                const dist = Math.sqrt(
                    Math.pow(head.x - firstHead.x, 2) +
                    Math.pow(head.y - firstHead.y, 2) +
                    Math.pow(head.z - firstHead.z, 2)
                );
                if (dist > maxDrift) maxDrift = dist;
            }
        }
    }

    const spineAngleStability = 5.0; // Placeholder
    const leadLegBlock = 8.0; // Placeholder

    return {
        headDrift: maxDrift,
        spineAngleStability,
        leadLegBlock
    };
}

function calculateROM(poses: Pose[]): ROMMetrics {
    return {
        hipSeparation: 45,
        shoulderSeparation: 90,
        xFactor: 45,
        rangeNorm: 0.85
    };
}
