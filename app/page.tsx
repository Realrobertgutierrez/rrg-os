export default function Home() {
    return (
        <main style={{ padding: '2rem', fontFamily: 'system-ui', color: '#fff', background: '#000', minHeight: '100vh' }}>
            <h1>RRG OS — Agents</h1>
            <p style={{ color: '#888' }}>Automated content intelligence running on Vercel Cron.</p>
            <ul style={{ color: '#666', marginTop: '1rem' }}>
                <li><code>/api/cron/scan-world</code> — 3:00 AM MST daily</li>
                <li><code>/api/cron/scan-content</code> — 6:00 AM MST daily</li>
                <li><code>/api/cron/generate-brief</code> — 7:00 AM MST daily</li>
            </ul>
        </main>
    );
}
