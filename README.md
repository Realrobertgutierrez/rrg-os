# RRG OS — Automated Content Intelligence

Your personal agent infrastructure running on Vercel. Scans the world, analyzes your content, and generates a daily brief — all while you sleep.

## Cron Schedule (MST)

| Time | Agent | What It Does |
|------|-------|--------------|
| 3:00 AM | `scan-world` | Scans AI, economy, content, and crypto trends via Exa |
| 6:00 AM | `scan-content` | Pulls your Instagram analytics and identifies patterns |
| 7:00 AM | `generate-brief` | Synthesizes everything into your morning brief with content ideas |

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your API keys
3. `npm install`
4. `npm run dev` for local testing
5. Push to GitHub → auto-deploys to Vercel

## Environment Variables

Set these in Vercel dashboard → Settings → Environment Variables:

- `OPENAI_API_KEY` — for GPT synthesis
- `EXA_API_KEY` — for web scanning
- `CRON_SECRET` — Vercel cron auth (generate any random string)

## Architecture

```
/api/cron/scan-world     → Exa API → raw signals
/api/cron/scan-content   → Instagram Graph API → performance data
/api/cron/generate-brief → GPT-4o-mini → synthesized morning brief
```

## Roadmap

- [ ] Supabase integration for persisting scan results and briefs
- [ ] Telegram bot for morning brief delivery
- [ ] Instagram Graph API integration for content analytics
- [ ] Brand partnership outreach agent
- [ ] Dashboard page for visual overview
