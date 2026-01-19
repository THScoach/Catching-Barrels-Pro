
import { RebootClient } from '../lib/reboot/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const client = new RebootClient();
    const sessionId = '2e3dbe0b-4031-47fc-8a65-db603abf6e62'; // Hitting Session
    const orgPlayerId = 'f18c7af2-75c4-4ee6-b544-db6b0b15f262'; // Freddie Freeman

    console.log('Testing exportSwingData with movementTypeId: 1 (Hitting)...');
    try {
        const data = await client.exportSwingData(sessionId, orgPlayerId, 1);
        console.log('Success! Data received:', JSON.stringify(data).substring(0, 200) + '...');
    } catch (error: any) {
        console.error('Error exporting data:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', await error.response.json());
        }
    }
}

main();
