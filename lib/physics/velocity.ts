import { Pose, Point3D } from './types';
import { calculateSmoothingWindow } from './fps-handler';

/**
 * Calculates the angular velocity (rad/s) of a segment over time.
 * Uses finite difference method on joint angles.
 */
export function calculateAngularVelocities(
    poses: Pose[],
    fps: number = 30 // Default to 30 if unknown, but should be passed from video metadata
): Record<string, number[]> {
    const velocities: Record<string, number[]> = {
        pelvis: [],
        torso: [],
        arms: [],
        bat: []
    };

    if (poses.length < 2) return velocities;

    const dt = 1 / fps;

    // Helper to get angle of a segment in the horizontal plane (XY)
    // Returns angle in radians [-PI, PI]
    const getSegmentAngle = (pose: Pose, segment: string): number => {
        const joints = pose.joints;
        let p1: Point3D, p2: Point3D;

        switch (segment) {
            case 'pelvis':
                // Vector from Left Hip to Right Hip
                if (!joints['left_hip'] || !joints['right_hip']) return 0;
                p1 = joints['left_hip'].position;
                p2 = joints['right_hip'].position;
                break;
            case 'torso':
                // Vector from Left Shoulder to Right Shoulder
                if (!joints['left_shoulder'] || !joints['right_shoulder']) return 0;
                p1 = joints['left_shoulder'].position;
                p2 = joints['right_shoulder'].position;
                break;
            case 'arms':
                // Vector from Lead Shoulder (Left for Righty) to Hands
                // Assuming Righty for now (Left Shoulder -> Right Wrist)
                // TODO: Detect handedness
                if (!joints['left_shoulder'] || !joints['right_wrist']) return 0;
                p1 = joints['left_shoulder'].position;
                p2 = joints['right_wrist'].position;
                break;
            case 'bat':
                // Vector from Hands to Bat End (if available) or Wrist to Elbow extension
                // For now, use Wrist to Elbow as proxy for forearm/bat complex if bat points missing
                // Ideally we have 'bat_handle' and 'bat_tip'
                // Fallback: Right Elbow -> Right Wrist
                if (!joints['right_elbow'] || !joints['right_wrist']) return 0;
                p1 = joints['right_elbow'].position;
                p2 = joints['right_wrist'].position;
                break;
            default:
                return 0;
        }

        // Calculate angle in XY plane (top-down view)
        // atan2(dy, dx)
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    };

    // Calculate raw velocities
    for (let i = 0; i < poses.length - 1; i++) {
        const currentPose = poses[i];
        const nextPose = poses[i + 1];

        ['pelvis', 'torso', 'arms', 'bat'].forEach(segment => {
            const angle1 = getSegmentAngle(currentPose, segment);
            const angle2 = getSegmentAngle(nextPose, segment);

            // Handle wrap-around (e.g. 179 deg -> -179 deg)
            let diff = angle2 - angle1;
            if (diff > Math.PI) diff -= 2 * Math.PI;
            if (diff < -Math.PI) diff += 2 * Math.PI;

            const velocity = diff / dt; // rad/s
            velocities[segment].push(velocity);
        });
    }

    // Pad the last frame to match pose length
    ['pelvis', 'torso', 'arms', 'bat'].forEach(segment => {
        if (velocities[segment].length > 0) {
            velocities[segment].push(velocities[segment][velocities[segment].length - 1]);
        }
    });

    // Smooth velocities (Adaptive Moving Average)
    const windowSize = calculateSmoothingWindow(fps);
    ['pelvis', 'torso', 'arms', 'bat'].forEach(segment => {
        velocities[segment] = smoothArray(velocities[segment], windowSize);
    });

    return velocities;
}

function smoothArray(data: number[], windowSize: number): number[] {
    const smoothed: number[] = [];
    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;
        for (let j = Math.max(0, i - Math.floor(windowSize / 2)); j <= Math.min(data.length - 1, i + Math.floor(windowSize / 2)); j++) {
            sum += data[j];
            count++;
        }
        smoothed.push(sum / count);
    }
    return smoothed;
}
