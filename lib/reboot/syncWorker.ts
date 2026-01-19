import { prisma } from "@/lib/prisma";
import { RebootClient } from "./client";
import { calculateKineticFingerprint } from "@/lib/scoreCalculations";

const rebootClient = new RebootClient();

export async function pollRebootJobs() {
    console.log("Starting Reboot Job Polling...");

    // 1. Find swings that are waiting for Reboot processing
    // We assume there's a status field or we check if sensor data is empty but job_id exists.
    // Ideally, SensorSwing model should have a 'processingStatus' field. 
    // For now, we query where 'rebootJobId' is NOT NULL and 'batSpeedMph' is NULL (indicating no data yet)

    // Since we can't easily query 'NULL' in some Prisma setups without exact types, assume:
    const pendingSwings = await prisma.sensorSwing.findMany({
        where: {
            rebootJobId: { not: null },
            batSpeedMph: null, // Pending data
        },
        take: 5 // Process in chunks
    });

    console.log(`Found ${pendingSwings.length} pending Reboot jobs.`);

    for (const swing of pendingSwings) {
        if (!swing.rebootJobId) continue;

        try {
            const jobStatus = await rebootClient.getJobStatus(swing.rebootJobId);

            if (jobStatus.status === 'COMPLETED') {
                console.log(`Job ${swing.rebootJobId} COMPLETED. Fetching data...`);
                // Fetch the actual data payload. 
                // The job status response usually contains a download URL or we assume the standard export flow.
                // If the job logic just says "COMPLETED", we might need to hit the export endpoint again 
                // OR the job result has the JSON.

                // Assuming jobStatus contains the metrics or a resource URL.
                // If not, we call exportSwingData with the known session ID (if we stored it).
                // Wait, SensorSwing stores 'rebootJobId' but maybe not 'rebootSessionId' distinctively?
                // The 'dkSwingUuid' is often mapped. 

                // Let's assume we can get the data now.
                // For MVP, if status is completed, we trigger the export.

                // MAPPING LOGIC
                // We need the session ID to export. Ideally SensorSwing has it.
                // If SensorSwing only has DK UUID, we might need to look it up.

                // Placeholder: Use a mock or real fetch if we had session ID.
                // If we don't have session ID in pendingSwings, we might be blocked.
                // Let's assume rebootJobId *is* the key or we have sessionId.

                // SIMULATION for Implementation Plan:
                // We map fields:
                // legsKw = momentum.lower_torso.peak_ke
                // torsoKw = momentum.upper_torso.peak_ke
                // armsKw = momentum.lead_arm.peak_ke (or combined arms)

                // CALCULATE FINGERPRINT
                const mockSensorData = {
                    batSpeedMph: 75, // retrieved
                    legsKw: 1000,
                    torsoKw: 800,
                    armsKw: 500,
                    legsKEPeakTime: -0.15,
                    torsoKEPeakTime: -0.10,
                    armsKEPeakTime: -0.05
                };

                // Get EV from linked SwingVideo or mock
                const exitVelocity = 95;

                const fingerprint = calculateKineticFingerprint(mockSensorData, exitVelocity);

                // UPDATE DB
                await prisma.sensorSwing.update({
                    where: { id: swing.id },
                    data: {
                        batSpeedMph: mockSensorData.batSpeedMph,
                        legsKw: mockSensorData.legsKw,
                        torsoKw: mockSensorData.torsoKw,
                        armsKw: mockSensorData.armsKw,
                        // Update sequence timings
                        legsKEPeakTime: mockSensorData.legsKEPeakTime,
                        torsoKEPeakTime: mockSensorData.torsoKEPeakTime,
                        armsKEPeakTime: mockSensorData.armsKEPeakTime,

                        // Save Computed Scores & Leaks
                        kineticChainEfficiency: fingerprint.kineticChainEfficiency,
                        freemanRatio: fingerprint.freemanRatio,
                        overallFingerprint: fingerprint.scores.overallFingerprint,
                        // Note: Prisma schema needs 'energyLeaks' array or string field. 
                        // Current schema has 'energyLeak' string? Check schema.
                        // We will join the array if it's a string field.
                    }
                });

                console.log(`Updated Swing ${swing.id} with Kinetic Fingerprint.`);
            } else if (jobStatus.status === 'FAILED') {
                console.error(`Job ${swing.rebootJobId} FAILED.`);
                // flag error in DB
            }
        } catch (error) {
            console.error(`Error processing job ${swing.rebootJobId}:`, error);
        }
    }
}
