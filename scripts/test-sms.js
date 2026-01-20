// Native fetch (Node 18+)

async function testSMS() {
    const url = 'http://localhost:3000/api/chat/sms';

    // 1. Simulate a User (We need to ensure a user with this number exists in DB for full test, 
    //    but the endpoint handles null users gracefully for now or we can mock one)
    const payload = {
        From: "+15551234567",
        Body: "I keep popping up to the opposite field. What's wrong?"
    };

    console.log("📱 Sending Mock SMS...");
    console.log(`From: ${payload.From}`);
    console.log(`Message: ${payload.Body}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("\n🤖 Response (TwiML):");
        console.log(text);

    } catch (e) {
        console.error("Error:", e);
    }
}

testSMS();
