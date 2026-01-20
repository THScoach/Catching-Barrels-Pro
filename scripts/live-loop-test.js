// Native fetch (Node 18+)
// RUN WITH: npm run dev (in separate terminal) AND THEN node scripts/live-loop-test.js

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runLiveLoop() {
    console.log("🦅 BARRELS LIVE LOOP VALIDATION 🦅");
    const timestamp = Date.now();
    const TEST_PHONE = `+199988877${Math.floor(Math.random() * 99)}`; // Random-ish number
    const INGEST_URL = 'http://localhost:3000/api/videos/ingest';
    const SMS_URL = 'http://localhost:3000/api/chat/sms';

    // STEP 1: VIDEO PIPELINE VALIDATION
    console.log("\n[Step 1] Testing Video Pipeline...");
    const ingestPayload = {
        fileId: `live_loop_vid_${timestamp}`,
        fileName: "LiveLoop_Slingshotter_Drill.mp4",
        fileUrl: "https://example.com/slingshot.mp4",
        transcript: "Rick here. You need more stretch. Think of it like a bow and arrow. Create tension. If you don't have stretch, you don't have a slingshot."
    };

    try {
        const ingestRes = await fetch(INGEST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ingestPayload)
        });
        const ingestData = await ingestRes.json();

        if (ingestData.data?.vectorTag === 'Slingshotter') {
            console.log("✅ Video Ingested & Tagged: Slingshotter");
        } else {
            console.log("❌ Video Ingest Fail:", ingestData);
        }
    } catch (e) {
        console.error("❌ Ingest Error:", e.message);
    }

    // STEP 2: USER PROFILE MOCK (We can't hit a 'create user' API easily, so we assume the SMS endpoint will handle a 'General' user if not found, OR we rely on the implementation plan's DB seed. For this test, we accept 'General' or modify the code to mock DB Insert if we had a dedicated test-seed script. 
    // BUT the prompt asks to 'Send a live text... If user is new... return General'. So we test the 'New User' flow.)

    console.log(`\n[Step 2] Testing SMS for New User (${TEST_PHONE})...`);

    const smsPayload = {
        From: TEST_PHONE,
        Body: "I feel like I'm casting my hands."
    };

    try {
        const smsRes = await fetch(SMS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Simulating JSON for simplicity, actual Twilio is Form
            body: JSON.stringify(smsPayload)
        });

        const smsText = await smsRes.text();

        // STEP 3: PERSONA CHECK
        console.log("\n[Step 3] Persona Validation:");
        console.log(smsText);

        if (smsText.includes("(Mock") || smsText.includes("Rick")) {
            console.log("✅ Response Received");
        } else {
            console.log("❌ Valid Response Config Missing");
        }

        if (smsText.includes("General")) {
            console.log("✅ Correctly identified as New/General user.");
        }

    } catch (e) {
        console.error("❌ SMS Error:", e.message);
    }

    // STEP 4: GHL Check
    // Can't verify GHL 'forwarding' return without mocking that endpoint too, but looking for logs in the server output
    console.log("\n[Step 4] GHL Handshake:");
    console.log("➡️ Check Server Logs for: '[GHL] Forwarded message...' (Only if GHL_WEBHOOK_URL is set)");

    console.log("\n-------------------------------------------");
    console.log("🏁 Live Loop Complete.");
}

runLiveLoop();
