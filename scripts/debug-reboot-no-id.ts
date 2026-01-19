import { RebootClient } from '../lib/reboot/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.log('🚀 Debugging Reboot Export WITHOUT Player ID...');

    const client = new RebootClient();
    // Use a known valid session ID from previous steps (if we have one)
    // The user provided 39db7bd4... which was empty/invalid for hitting.
    // I found bd3d4759... in the list for Freddie.
    const sessionId = 'bd3d4759-01d1-4142-8371-24ed2deb5aae';

    try {
        console.log(`\nTesting Metadata Lookup for Session: ${sessionId}`);

        const apiKey = process.env.REBOOT_API_KEY;
        const baseUrl = process.env.REBOOT_API_URL || 'https://api.rebootmotion.com';
        const headers = {
            'x-api-key': apiKey || '',
            'Content-Type': 'application/json'
        };

        // Try GET /sessions/:id
        try {
            console.log('Attempting GET /sessions/' + sessionId);
            const res1 = await fetch(`${baseUrl}/sessions/${sessionId}`, { headers });
            if (res1.ok) {
                console.log('✅ SUCCESS /sessions/:id');
                console.log(await res1.json());
                return;
            } else {
                console.log(`❌ FAILED /sessions/:id: ${res1.status}`);
            }
        } catch (e) { }

        // Try GET /session/:id
        try {
            console.log('Attempting GET /session/' + sessionId);
            const res2 = await fetch(`${baseUrl}/session/${sessionId}`, { headers });
            if (res2.ok) {
                console.log('✅ SUCCESS /session/:id');
                console.log(await res2.json());
                return;
            } else {
                console.log(`❌ FAILED /session/:id: ${res2.status}`);
            }
        } catch (e) { }

        // Try GET /sessions?session_id=:id
        try {
            console.log('Attempting GET /sessions?session_id=' + sessionId);
            const res3 = await fetch(`${baseUrl}/sessions?session_id=${sessionId}`, { headers });
            if (res3.ok) {
                console.log('✅ SUCCESS /sessions?session_id=...');
                console.log(await res3.json());
                return;
            } else {
                console.log(`❌ FAILED /sessions?session_id=...: ${res3.status}`);
            }
        } catch (e) { }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
