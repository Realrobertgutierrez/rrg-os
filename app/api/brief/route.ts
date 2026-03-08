import { NextResponse } from 'next/server';
import { scanWorld } from '@/lib/exa';
import { synthesizeBrief } from '@/lib/claude';

export const maxDuration = 120;

/**
 * On-demand brief generation endpoint.
 * Called by the dashboard page to generate a fresh brief.
 */
export async function POST() {
    try {
        // Step 1: Scan the world
        const worldSignals = await scanWorld();

        // Step 2: Format for synthesis
        const rawData = worldSignals.map((s, i) =>
            `[Signal ${i + 1}] ${s.title}\nSource: ${s.url}\nDate: ${s.publishedDate || 'Unknown'}\nSummary: ${s.summary}`
        ).join('\n\n---\n\n');

        // Step 3: Generate brief via Claude
        const brief = await synthesizeBrief(rawData);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            signalCount: worldSignals.length,
            signals: worldSignals.slice(0, 5),
            brief,
        });
    } catch (error) {
        console.error('[RRG OS] Brief generation failed:', error);
        return NextResponse.json(
            { error: 'Brief generation failed. Check API keys.' },
            { status: 500 }
        );
    }
}
