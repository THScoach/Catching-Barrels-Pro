import { NextRequest, NextResponse } from 'next/server';
import { RebootClient } from '@/lib/reboot/client';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const client = new RebootClient();
        const players = await client.searchPlayers(query);
        return NextResponse.json({ players });
    } catch (error: any) {
        console.error('Error searching players:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
