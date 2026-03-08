import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY!);

export interface ScanResult {
    title: string;
    url: string;
    summary: string;
    publishedDate: string | null;
}

/**
 * Scan the web for signals across key domains relevant to RRG OS.
 * Categories: AI/Tech, Markets/Economy, Content Strategy, Global Trends
 */
export async function scanWorld(): Promise<ScanResult[]> {
    const queries = [
        'AI agents autonomous systems latest breakthroughs this week',
        'agentic AI startups funding Silicon Valley',
        'creator economy brand deals content monetization trends',
        'global economic shifts K-shaped economy wealth divide',
        'stablecoins DeFi crypto AI convergence',
    ];

    const allResults: ScanResult[] = [];

    for (const query of queries) {
        try {
            const response = await exa.searchAndContents(query, {
                type: 'neural',
                useAutoprompt: true,
                numResults: 3,
                text: { maxCharacters: 500 },
                startPublishedDate: getDateDaysAgo(2),
            });

            for (const result of response.results) {
                allResults.push({
                    title: result.title || 'Untitled',
                    url: result.url,
                    summary: result.text || '',
                    publishedDate: result.publishedDate || null,
                });
            }
        } catch (err) {
            console.error(`Exa scan failed for query "${query}":`, err);
        }
    }

    return allResults;
}

function getDateDaysAgo(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
}
