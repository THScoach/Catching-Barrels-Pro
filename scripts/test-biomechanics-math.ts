import { analyzeSwingBiomechanics } from '../lib/physics/biomechanics-core';
import { Pose, AthleteData, Point3D } from '../lib/physics/types';

// Mock Data Generator
function generateMockPoses(frames: number, fps: number = 30): Pose[] {
    const poses: Pose[] = [];

    for (let i = 0; i < frames; i++) {
        const t = i / fps;

        const createJoint = (name: string, radius: number, speed: number, phase: number) => {
            const angle = speed * t + phase;
            return {
                name,
                position: {
                    x: radius * Math.cos(angle),
                    y: radius * Math.sin(angle),
                    z: 1.0 // Height
                },
                confidence: 1.0
            };
        };

        // Pelvis rotates at 5 rad/s (~286 deg/s) -> Low score expected
        const pelvisL = createJoint('left_hip', 0.2, 5, 0);
        const pelvisR = createJoint('right_hip', 0.2, 5, Math.PI);

        // Torso rotates at 8 rad/s (~458 deg/s) -> Low score expected
        const shoulderL = createJoint('left_shoulder', 0.3, 8, -0.2);
        const shoulderR = createJoint('right_shoulder', 0.3, 8, Math.PI - 0.2);

        // Arms rotate faster (12 rad/s ~ 687 deg/s)
        const wristR = createJoint('right_wrist', 0.5, 12, -0.4);
        const elbowR = createJoint('right_elbow', 0.4, 10, -0.3);

        // Legs
        const kneeR = createJoint('right_knee', 0.2, 5, Math.PI);
        const ankleR = createJoint('right_ankle', 0.2, 5, Math.PI);
        const kneeL = createJoint('left_knee', 0.2, 5, 0);
        const ankleL = createJoint('left_ankle', 0.2, 5, 0);

        poses.push({
            timestamp: t,
            joints: {
                'left_hip': pelvisL,
                'right_hip': pelvisR,
                'left_shoulder': shoulderL,
                'right_shoulder': shoulderR,
                'right_wrist': wristR,
                'right_elbow': elbowR,
                'right_knee': kneeR,
                'right_ankle': ankleR,
                'left_knee': kneeL,
                'left_ankle': ankleL,
                'mid_hip': { name: 'mid_hip', position: { x: 0, y: 0, z: 1 }, confidence: 1 },
                'neck': { name: 'neck', position: { x: 0, y: 0, z: 1.5 }, confidence: 1 },
                'nose': { name: 'nose', position: { x: 0, y: 0.1 * Math.sin(t), z: 1.6 }, confidence: 1 }
            }
        });
    }
    return poses;
}

async function main() {
    console.log('🚀 Starting Scoring System Verification...');

    const athleteData: AthleteData = {
        weightKg: 85,
        heightCm: 185
    };

    // Test 1: 240 FPS (Professional)
    console.log('\n--- Test 1: 240 FPS Mock Data ---');
    const poses240 = generateMockPoses(240, 240); // 1 second
    const result = analyzeSwingBiomechanics(poses240, athleteData);

    console.log('\n📊 Flow Scores (0-10):');
    console.log(`   ⚓ Anchor: ${result.scores.anchor}`);
    console.log(`   ⚡ Engine (Core): ${result.scores.core}`);
    console.log(`   ⚔ Weapon (Whip): ${result.scores.whip}`);
    console.log(`   🏆 Overall: ${result.scores.overall}`);

    console.log('\n🔍 Details:');
    console.log(`   Pelvis Velo Score: ${result.scores.details.anchor.pelvisVelocity.toFixed(1)}`);
    console.log(`   Torso Velo Score: ${result.scores.details.core.torsoVelocity.toFixed(1)}`);
    console.log(`   Bat Velo Score: ${result.scores.details.whip.batVelocity.toFixed(1)}`);

    // Assertions
    if (result.scores.overall > 0 && result.scores.overall <= 10) {
        console.log('\n✅ PASS: Overall score is within 0-10 range.');
    } else {
        console.error('\n❌ FAIL: Overall score out of range.');
    }

    if (result.scores.anchor > 0 && result.scores.core > 0 && result.scores.whip > 0) {
        console.log('✅ PASS: All sub-scores calculated.');
    } else {
        console.error('❌ FAIL: Missing sub-scores.');
    }
}

main();
