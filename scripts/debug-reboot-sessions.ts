import { RebootClient } from '../lib/reboot/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.log('🚀 Debugging Reboot Sessions...');

    const client = new RebootClient();
    // Freddie Freeman's ID from previous context
    const freddieId = 'f18c7af2-75c4-4ee6-b544-db6b0b15f262';

    try {
        console.log(`Fetching sessions for player: ${freddieId}`);
        const response = await client.listSessions(freddieId, 100); // Get more sessions
        const sessions = response.sessions || response;

        if (!sessions || sessions.length === 0) {
            console.log('No sessions found.');
            return;
        }

        const targetSessionId = '39db7bd4-d249-4112-ba8a-61eaed233fab';
        const foundSession = sessions.find((s: any) => (s.id === targetSessionId || s.session_id === targetSessionId));

        if (foundSession) {
            console.log(`\n✅ FOUND Target Session in list: ${targetSessionId}`);
            console.log('Session Details:', JSON.stringify(foundSession, null, 2));
        } else {
            console.log(`\n❌ Target Session ${targetSessionId} NOT FOUND in player's session list.`);
            console.log('First 5 sessions found:', sessions.slice(0, 5).map((s: any) => s.id || s.session_id));
        }

        // Retry export if found, using hitting-lite-processed-metrics
        if (foundSession) {
            try {
                console.log('\n--- Attempting Export with hitting-lite-processed-metrics ---');
                const dataLite = await client.exportSwingData(targetSessionId, freddieId, 1, 'hitting-lite-processed-metrics');
                console.log('✅ SUCCESS with Lite Metrics!');
                console.log('Keys:', Object.keys(dataLite.metrics || {}).slice(0, 5));
            } catch (e: any) {
                console.log('❌ FAILED with Lite Metrics:', e.message);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
