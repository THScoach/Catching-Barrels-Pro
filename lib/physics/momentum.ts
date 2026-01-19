import { Point3D, SegmentDimensions, AthleteData } from './types';
import { calculateSegmentMasses, calculateMomentOfInertia, estimateSegmentDimensions } from './anthropometry';

export interface MomentumResult {
    magnitude: number;
    projected: number;
    peakTime: number;
    peakValue: number;
}

// Helper: Dot product of two 3D vectors
function dotProduct(v1: Point3D, v2: Point3D): number {
    return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
}

// Helper: Calculate angular velocity (rad/s) from orientation changes
// Simplified: Assumes we have angular velocity scalar or vector from pose estimator
// If not, we'd need to differentiate orientation quaternions/matrices over time.
// For Phase 1, we'll assume the input `angularVelocity` is provided or calculated simply.
export function calculateAngularMomentum(
    segmentName: string,
    angularVelocity: number, // rad/s (magnitude)
    axisOfRotation: Point3D, // Unit vector
    athleteData: AthleteData,
    segmentDims: SegmentDimensions
): number {
    const masses = calculateSegmentMasses(athleteData.weightKg);
    // @ts-ignore - dynamic access
    const mass = masses[segmentName] || masses['trunk']; // Fallback

    const inertia = calculateMomentOfInertia(mass, segmentDims.length, segmentDims.radius);

    // L = I * w
    return inertia * angularVelocity;
}

// Project momentum onto a target direction (e.g., toward pitcher)
export function projectMomentum(
    momentumMagnitude: number,
    rotationAxis: Point3D,
    targetDirection: Point3D
): number {
    // Momentum vector L is aligned with the rotation axis
    // L_vec = magnitude * axis
    // Projected = L_vec . target

    // However, usually we want the component contributing to the swing plane or specific direction.
    // Reboot's "projected" often refers to the component useful for the hit.
    // If rotation axis is Z (vertical), and target is Y (pitcher), dot product is 0.
    // But for a swing, the rotation axis is the spine/body axis.
    // The "useful" momentum is the one rotating AROUND the spine, which drives the bat.
    // So we might just return the magnitude if the axis is correct, or project it if the axis is tilted.

    // For now, we'll implement the vector projection:
    // L_proj = (L_mag * axis) . target

    return momentumMagnitude * dotProduct(rotationAxis, targetDirection);
}

// Calculate Orbital Angular Momentum (L = r x p = m * (r x v))
// Simplified for planar rotation: L = m * r^2 * w
export function calculateOrbitalMomentum(
    mass: number,
    distanceToAxis: number,
    angularVelocity: number // rad/s of the orbit
): number {
    // I_point = m * r^2
    const inertia = mass * Math.pow(distanceToAxis, 2);
    return inertia * angularVelocity;
}
