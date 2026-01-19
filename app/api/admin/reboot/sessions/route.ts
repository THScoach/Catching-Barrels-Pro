import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RebootClient } from '@/lib/reboot/client';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const orgPlayerId = searchParams.get('orgPlayerId');
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

        if (!orgPlayerId) {
            return NextResponse.json({ error: 'orgPlayerId is required' }, { status: 400 });
        }

        const client = new RebootClient();
        // Fetch all sessions (undefined movementTypeId)
        const data = await client.listSessions(orgPlayerId, limit, undefined);

        // Handle both array response and object response
        const sessions = Array.isArray(data) ? data : (data.sessions || []);

        return NextResponse.json({ sessions });

    } catch (error: any) {
        console.error('Fetch Reboot Sessions Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
