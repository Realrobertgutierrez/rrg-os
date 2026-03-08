import { NextRequest, NextResponse } from 'next/server';
import { scanWorld } from '@/lib/exa';
import { synthesizeBrief } from '@/lib/openai';

export const maxDuration = 120;

export async function GET(request: NextRequest) {
    // Verify this is a legitimate cron call
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[RRG OS] 📋 Generating daily brief...');

        // Step 1: Get fresh scan data
        // TODO: Once Supabase is integrated, read from stored scan results instead
        const worldSignals = await scanWorld();

        // Step 2: Format signals for the synthesizer
        const rawData = worldSignals.map((s, i) =>
            `[Signal ${i + 1}] ${s.title}\nSource: ${s.url}\nDate: ${s.publishedDate || 'Unknown'}\nSummary: ${s.summary}`
        ).join('\n\n---\n\n');

        // Step 3: Generate the brief with GPT
        const brief = await synthesizeBrief(rawData);

        console.log('[RRG OS] ✅ Daily brief generated.');

        // TODO: Send brief via Telegram bot
        // TODO: Store brief in Supabase for dashboard access

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            signalCount: worldSignals.length,
            brief,
        });
    } catch (error) {
        console.error('[RRG OS] ❌ Brief generation failed:', error);
        return NextResponse.json({ error: 'Brief generation failed' }, { status: 500 });
    }
}
