import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pollRebootJobs } from '@/lib/reboot/syncWorker';

// Webhook receiver for Reboot Motion
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Reboot Webhook Received:", body);

        // Expect event_type: "job_completed" or similar
        // Body usually has { job_id: "...", status: "COMPLETED" }

        const jobId = body.job_id;

        if (jobId) {
            // Trigger the worker logic immediately for this job (or generic poll)
            // For robustness, we can just call the poller to find this job and update it.
            // Or ideally, update specific job. 
            // Since pollRebootJobs looks for pending DB items, ensure we don't race condition.

            // Just ack the webhook and fire-and-forget the poller (in a real queue system)
            // Next.js serverless functions might terminate, so await is safer.
            await pollRebootJobs();
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }
}
