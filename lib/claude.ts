import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

/**
 * Given a set of raw scan results, synthesize them into a daily brief
 * using the RRG OS voice and audience-first framework.
 */
export async function synthesizeBrief(scanResults: string): Promise<string> {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: `You are the RRG OS intelligence agent. Your job is to take raw news and trend data and produce a daily brief for Robert Gutierrez.

Robert's thesis: We are in the early stages of the singularity. AI agents are removing humans from execution loops. The K-shaped economy is splitting people into those who orchestrate AI and those managed by it. Skills and information are commoditized — the only human value is brand, network, capital, and orchestration taste.

Your output should include:
1. **Top 3 Signals** — The most important things that happened in the last 24 hours, explained through Robert's worldview
2. **Content Opportunities** — 2-3 story/post ideas inspired by today's signals, written using the audience-first formula:
   - Start with the viewer's pain/confusion
   - Validate it
   - Deliver the insight
   - Show how to apply it
3. **One Bold Prediction** — A contrarian or forward-looking take Robert can make based on today's data

Write in a direct, confident voice. No fluff. No corporate speak. Think insider briefing, not news summary.`,
        messages: [
            {
                role: 'user',
                content: `Here are today's raw scan results:\n\n${scanResults}`,
            },
        ],
    });

    const textBlock = response.content.find(block => block.type === 'text');
    return textBlock ? textBlock.text : 'Brief generation failed.';
}

/**
 * Analyze content performance data and provide actionable recommendations.
 */
export async function analyzeContentPerformance(analyticsData: string): Promise<string> {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are a content strategist analyzing Instagram performance data for Robert Gutierrez (@robertgutierrez). 

Focus on:
- Which content got SAVES (high intent) vs. just views (low intent)
- Patterns in what topics/formats drive engagement
- Specific recommendations for what to post next based on audience behavior
- Honest assessment of what's not working and why

Use the audience-first framework: the goal isn't more views, it's deeper connection with the ICP. A post with 50 views and 10 saves is more valuable than one with 1000 views and 0 saves.`,
        messages: [
            {
                role: 'user',
                content: analyticsData,
            },
        ],
    });

    const textBlock = response.content.find(block => block.type === 'text');
    return textBlock ? textBlock.text : 'Analysis failed.';
}
