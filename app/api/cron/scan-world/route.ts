import { NextRequest, NextResponse } from 'next/server';
import { scanWorld } from '@/lib/exa';

export const maxDuration = 60;

export async function GET(request: NextRequest) {
    // Verify this is a legitimate cron call
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('[RRG OS] 🌍 Starting world scan...');
        const results = await scanWorld();
        console.log(`[RRG OS] ✅ World scan complete. Found ${results.length} signals.`);

        // For now, log the results. Once we add a database, we'll persist them.
        // TODO: Store in Supabase for the generate-brief step to read
        const summary = results.map((r, i) =>
            `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.summary.slice(0, 200)}...`
        ).join('\n\n');

        return NextResponse.json({
            success: true,
            signalCount: results.length,
            timestamp: new Date().toISOString(),
            signals: results,
            preview: summary,
        });
    } catch (error) {
        console.error('[RRG OS] ❌ World scan failed:', error);
        return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
    }
}
