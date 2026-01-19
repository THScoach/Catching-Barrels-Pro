import { AthleteData, Pose, Point3D, SegmentDimensions } from './types';

// de Leva (1996) adjustments to Zatsiorsky-Seluyanov
// Percentages of Total Body Mass
export const SEGMENT_MASS_PERCENTAGES = {
    head: 0.0694,
    trunk: 0.4346,
    upperArm: 0.0271,
    forearm: 0.0162,
    hand: 0.0061,
    thigh: 0.1416,
    shank: 0.0433,
    foot: 0.0137,
};

// Calculate mass for specific segments based on total body mass
export function calculateSegmentMasses(totalMassKg: number) {
    return {
        head: totalMassKg * SEGMENT_MASS_PERCENTAGES.head,
        trunk: totalMassKg * SEGMENT_MASS_PERCENTAGES.trunk,
        pelvis: totalMassKg * 0.142, // Approx lower trunk
        upperTorso: totalMassKg * 0.2926, // Approx upper trunk
        upperArm: totalMassKg * SEGMENT_MASS_PERCENTAGES.upperArm,
        forearm: totalMassKg * SEGMENT_MASS_PERCENTAGES.forearm,
        hand: totalMassKg * SEGMENT_MASS_PERCENTAGES.hand,
        thigh: totalMassKg * SEGMENT_MASS_PERCENTAGES.thigh,
        shank: totalMassKg * SEGMENT_MASS_PERCENTAGES.shank,
        foot: totalMassKg * SEGMENT_MASS_PERCENTAGES.foot,
        bat: 0.85, // Approx 30oz bat in kg
    };
}

// Calculate Moment of Inertia (I) for a cylindrical segment
// I = (1/12)*m*L^2 + (1/4)*m*r^2
export function calculateMomentOfInertia(mass: number, length: number, radius: number): number {
    const lengthComponent = (1 / 12) * mass * Math.pow(length, 2);
    const radiusComponent = (1 / 4) * mass * Math.pow(radius, 2);
    return lengthComponent + radiusComponent;
}

// Helper to calculate distance between two 3D points
function distance(p1: Point3D, p2: Point3D): number {
    return Math.sqrt(
        Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2) +
        Math.pow(p2.z - p1.z, 2)
    );
}

// Estimate segment dimensions based on joint positions and athlete height
export function estimateSegmentDimensions(
    joints: Record<string, Point3D>,
    heightCm: number
): Record<string, SegmentDimensions> {
    const heightM = heightCm / 100;

    // Helper to safely get distance or default
    const getDist = (j1: string, j2: string, defaultLen: number) => {
        if (joints[j1] && joints[j2]) {
            return distance(joints[j1], joints[j2]);
        }
        return defaultLen;
    };

    // Approximations
    const pelvisLength = getDist('left_hip', 'right_hip', 0.3 * heightM);
    const torsoLength = getDist('mid_hip', 'neck', 0.5 * heightM); // Hip center to neck
    const armLength = getDist('right_shoulder', 'right_elbow', 0.3 * heightM) +
        getDist('right_elbow', 'right_wrist', 0.25 * heightM);

    // Radii are rough approximations based on height
    return {
        pelvis: { length: pelvisLength, radius: heightM * 0.08, mass: 0 },
        trunk: { length: torsoLength, radius: heightM * 0.12, mass: 0 }, // Using 'trunk' to match mass key
        torso: { length: torsoLength, radius: heightM * 0.12, mass: 0 }, // Alias
        head: { length: heightM * 0.15, radius: heightM * 0.09, mass: 0 },

        upperArm: { length: getDist('right_shoulder', 'right_elbow', 0.3 * heightM), radius: heightM * 0.05, mass: 0 },
        forearm: { length: getDist('right_elbow', 'right_wrist', 0.25 * heightM), radius: heightM * 0.04, mass: 0 },
        hand: { length: heightM * 0.1, radius: heightM * 0.02, mass: 0 },

        thigh: { length: getDist('right_hip', 'right_knee', 0.45 * heightM), radius: heightM * 0.07, mass: 0 },
        shank: { length: getDist('right_knee', 'right_ankle', 0.4 * heightM), radius: heightM * 0.05, mass: 0 },
        foot: { length: heightM * 0.15, radius: heightM * 0.03, mass: 0 },

        arms: { length: armLength, radius: heightM * 0.04, mass: 0 }, // Legacy/Composite
        bat: { length: 0.86, radius: 0.03, mass: 0.85 } // 34 inch bat
    };
}
