import 'dotenv/config';
import { RebootClient } from '../lib/reboot/client';

async function main() {
    console.log('Testing Reboot API Connection...');

    const client = new RebootClient();

    try {
        // Try to list swings (limit 1) to verify auth
        // Note: listSwings was not fully implemented in the client snippet I wrote earlier?
        // Let's check lib/reboot/client.ts content first.
        // I implemented listSwings in step 3653.
        const swings = await client.listSwings(1);
        console.log('✅ Connection Successful!');
        console.log('Swings found:', swings);
    } catch (error: any) {
        console.error('❌ Connection Failed:', error.message);
        process.exit(1);
    }
}

main();
