import { NextResponse } from 'next/server';
import { scanWorld } from '@/lib/exa';
import { synthesizeBrief } from '@/lib/claude';

export const maxDuration = 120;

export async function POST() {
    if (!process.env.EXA_API_KEY) {
        return NextResponse.json(
            { error: 'EXA_API_KEY not set. Add it in Vercel project settings.' },
            { status: 500 }
        );
    }
    if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
            { error: 'ANTHROPIC_API_KEY not set. Add it in Vercel project settings.' },
            { status: 500 }
        );
    }

    try {
        const worldSignals = await scanWorld();

        const rawData = worldSignals.map((s, i) =>
            `[Signal ${i + 1}] ${s.title}\nSource: ${s.url}\nDate: ${s.publishedDate || 'Unknown'}\nSummary: ${s.summary}`
        ).join('\n\n---\n\n');

        const brief = await synthesizeBrief(rawData);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            signalCount: worldSignals.length,
            signals: worldSignals.slice(0, 5),
            brief,
        });
    } catch (error: any) {
        console.error('[RRG OS] Brief generation failed:', error);
        return NextResponse.json(
            { error: error.message || 'Brief generation failed.' },
            { status: 500 }
        );
    }
}
