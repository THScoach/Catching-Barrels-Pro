import { analyzeSwingBiomechanics } from '../lib/physics/biomechanics-core';
import { Pose, AthleteData } from '../lib/physics/types';

function createMockPose(timestamp: number): Pose {
    return {
        timestamp,
        joints: {
            left_hip: { name: 'left_hip', position: { x: -0.15, y: 0, z: 0.9 } },
            right_hip: { name: 'right_hip', position: { x: 0.15, y: 0, z: 0.9 } },
            mid_hip: { name: 'mid_hip', position: { x: 0, y: 0, z: 0.9 } },
            neck: { name: 'neck', position: { x: 0, y: 0, z: 1.5 } },

            // Right Arm
            right_shoulder: { name: 'right_shoulder', position: { x: 0.2, y: 0, z: 1.4 } },
            right_elbow: { name: 'right_elbow', position: { x: 0.2, y: -0.3, z: 1.2 } },
            right_wrist: { name: 'right_wrist', position: { x: 0.2, y: -0.5, z: 1.0 } },

            // Left Arm (Mirrored roughly)
            left_shoulder: { name: 'left_shoulder', position: { x: -0.2, y: 0, z: 1.4 } },
            left_elbow: { name: 'left_elbow', position: { x: -0.2, y: -0.3, z: 1.2 } },
            left_wrist: { name: 'left_wrist', position: { x: -0.2, y: -0.5, z: 1.0 } },

            // Right Leg
            right_knee: { name: 'right_knee', position: { x: 0.2, y: 0.1, z: 0.5 } },
            right_ankle: { name: 'right_ankle', position: { x: 0.2, y: 0.2, z: 0.1 } },
            right_foot: { name: 'right_foot', position: { x: 0.2, y: 0.3, z: 0.0 } },

            // Left Leg
            left_knee: { name: 'left_knee', position: { x: -0.2, y: 0.1, z: 0.5 } },
            left_ankle: { name: 'left_ankle', position: { x: -0.2, y: 0.2, z: 0.1 } },
            left_foot: { name: 'left_foot', position: { x: -0.2, y: 0.3, z: 0.0 } }
        }
    };
}

async function main() {
    console.log('Testing Biomechanics Engine...');

    const athleteData: AthleteData = {
        weightKg: 82, // ~180 lbs
        heightCm: 183 // ~6 ft
    };

    const mockPoses = [createMockPose(0), createMockPose(0.1)];

    try {
        const result = analyzeSwingBiomechanics(mockPoses, athleteData);

        console.log('\n--- Results ---');
        console.log('Momentum (kg·m²/s):');
        console.log(`  Pelvis: ${result.momentum.pelvis.toFixed(2)}`);
        console.log(`  Torso:  ${result.momentum.torso.toFixed(2)}`);
        console.log(`  Arms:   ${result.momentum.arms.toFixed(2)}`);
        console.log(`  Bat:    ${result.momentum.bat.toFixed(2)}`);

        // Validation Checks
        const checks = [
            { name: 'Pelvis Momentum > 0', pass: result.momentum.pelvis > 0 },
            { name: 'Torso Momentum > Pelvis', pass: result.momentum.torso > result.momentum.pelvis }, // Usually true due to mass
            { name: 'Bat Momentum High', pass: result.momentum.bat > 10 } // High velocity
        ];

        console.log('\n--- Validation ---');
        checks.forEach(check => {
            console.log(`${check.pass ? '✅' : '❌'} ${check.name}`);
        });

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

main();
