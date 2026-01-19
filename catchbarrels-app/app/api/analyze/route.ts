import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    console.log('🎥 Received video for analysis...');

    try {
        const formData = await request.formData();
        const file = formData.get('video') as File;

        if (!file) {
            return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
        }

        console.log(`Processing file: ${file.name} (${file.size} bytes)`);

        // SIMULATE PROCESSING TIME
        await new Promise(resolve => setTimeout(resolve, 2500));

        // RETURN MOCK SCORES (Based on "Freddie Freeman" style data)
        // Anchor: Solid base
        // Core: High rotational velocity
        // Whip: Good bat lag
        const result = {
            scores: {
                anchor: 8.4,
                core: 9.2,
                whip: 7.8,
                overall: 8.5
            },
            metrics: {
                hip_velocity: 720, // deg/s
                shoulder_velocity: 950,
                bat_speed: 78, // mph
                time_to_contact: 0.15 // s
            },
            status: 'completed'
        };

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Analysis error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
