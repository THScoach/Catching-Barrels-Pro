import { NextRequest, NextResponse } from 'next/server';
import { RebootClient } from '@/lib/reboot/client';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const playerId = searchParams.get('playerId');

    if (!playerId) {
        return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    try {
        const client = new RebootClient();
        // Fetch last 20 sessions for this player
        const data = await client.listSessions(playerId, 20);
        return NextResponse.json({ sessions: data.sessions || [] });
    } catch (error: any) {
        console.error('Error listing sessions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
