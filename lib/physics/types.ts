export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface Joint {
    name: string;
    position: Point3D;
    confidence?: number;
}

export interface Pose {
    timestamp: number; // Seconds
    joints: Record<string, Joint>; // Map of joint name to Joint data
}

export interface AthleteData {
    weightKg: number;
    heightCm: number;
}

export interface SegmentDimensions {
    length: number; // Meters
    radius: number; // Meters
    mass: number;   // Kg
}

export interface StabilityMetrics {
    headDrift: number; // Max displacement in meters
    spineAngleStability: number; // Variance in degrees
    leadLegBlock: number; // Deceleration force proxy
}

export interface ROMMetrics {
    hipSeparation: number; // Max degrees
    shoulderSeparation: number; // Max degrees
    xFactor: number; // Max difference
    rangeNorm: number; // % of theoretical max used
}

export interface VideoQuality {
    fps: number;
    tier: 'elite' | 'professional' | 'standard' | 'insufficient';
    confidence: 'very_high' | 'high' | 'medium' | 'low';
    description: string;
}

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

export interface BiomechanicsResult {
    quality: VideoQuality;
    scores: FlowScores;
    momentum: {
        pelvis: number;
        torso: number;
        arms: number;
        bat: number;
    };
    sequence: {
        correct: boolean;
        peaks: Record<string, number>; // Normalized time 0-1
        score: number;
    };
    stability: StabilityMetrics;
    rom: ROMMetrics;
    normalizedData: {
        velocities: Record<string, number[]>; // 100 points
        momentum: Record<string, number[]>; // 100 points
    };
}
