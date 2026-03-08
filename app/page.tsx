'use client';

import { useState } from 'react';

interface Signal {
    title: string;
    url: string;
    summary: string;
    publishedDate: string | null;
}

interface BriefData {
    timestamp: string;
    signalCount: number;
    signals: Signal[];
    brief: string;
}

export default function Home() {
    const [briefData, setBriefData] = useState<BriefData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateBrief = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/brief', { method: 'POST' });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to generate brief');
            }
            const data = await res.json();
            setBriefData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <main style={styles.main}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>RRG OS</h1>
                <p style={styles.date}>{formatDate(new Date().toISOString())}</p>
            </header>

            {/* Status Bar */}
            <div style={styles.statusBar}>
                <div style={styles.statusItem}>
                    <span style={styles.statusLabel}>WORLD SCAN</span>
                    <span style={styles.statusValue}>3:00 AM</span>
                </div>
                <div style={styles.statusDivider} />
                <div style={styles.statusItem}>
                    <span style={styles.statusLabel}>CONTENT SCAN</span>
                    <span style={styles.statusValue}>6:00 AM</span>
                </div>
                <div style={styles.statusDivider} />
                <div style={styles.statusItem}>
                    <span style={styles.statusLabel}>BRIEF</span>
                    <span style={styles.statusValue}>7:00 AM</span>
                </div>
            </div>

            {/* Two-Column Grid: Generate + Content Overview */}
            <div style={styles.grid}>
                {/* Left: Generate Brief */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Daily Brief</h2>
                    <p style={styles.cardDescription}>
                        Scans AI, economy, crypto, and content trends. Synthesizes into actionable signals with content ideas.
                    </p>
                    {!loading ? (
                        <button onClick={generateBrief} style={styles.generateBtn}>
                            {briefData ? 'Regenerate' : 'Generate Brief'}
                        </button>
                    ) : (
                        <div style={styles.loadingRow}>
                            <div style={styles.spinner} />
                            <span style={styles.loadingLabel}>Scanning the world...</span>
                        </div>
                    )}
                    {error && <p style={styles.errorText}>{error}</p>}
                </div>

                {/* Right: Content Performance */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Content Performance</h2>
                    <p style={styles.cardDescription}>
                        Top performing content from the last 7 days. Pulls from Instagram and Notion.
                    </p>
                    <div style={styles.comingSoon}>
                        <p style={styles.comingSoonText}>Awaiting API integration</p>
                        <p style={styles.comingSoonSub}>Instagram Graph API + Notion API</p>
                    </div>
                </div>
            </div>

            {/* Brief Display */}
            {briefData && (
                <section style={styles.briefSection}>
                    <div style={styles.briefHeader}>
                        <h2 style={styles.briefTitle}>Today's Brief</h2>
                        <div style={styles.briefMeta}>
                            <span>{briefData.signalCount} signals scanned</span>
                            <span>{formatTime(briefData.timestamp)}</span>
                        </div>
                    </div>

                    <div style={styles.briefContent}>
                        {briefData.brief.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) {
                                return <h2 key={i} style={styles.h2}>{line.replace('# ', '')}</h2>;
                            }
                            if (line.startsWith('## ')) {
                                return <h3 key={i} style={styles.h3}>{line.replace('## ', '')}</h3>;
                            }
                            if (line.startsWith('### ')) {
                                return <h4 key={i} style={styles.h4}>{line.replace('### ', '')}</h4>;
                            }
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return <p key={i} style={styles.bold}>{line.replace(/\*\*/g, '')}</p>;
                            }
                            if (line.startsWith('- ')) {
                                return <p key={i} style={styles.bullet}>{line.replace('- ', '')}</p>;
                            }
                            if (line.trim() === '') {
                                return <div key={i} style={{ height: '10px' }} />;
                            }
                            return <p key={i} style={styles.paragraph}>{line}</p>;
                        })}
                    </div>

                    {/* Source Signals */}
                    {briefData.signals.length > 0 && (
                        <div style={styles.sourcesSection}>
                            <h3 style={styles.sourcesTitle}>Sources</h3>
                            <div style={styles.sourcesList}>
                                {briefData.signals.map((signal, i) => (
                                    <a
                                        key={i}
                                        href={signal.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={styles.sourceCard}
                                    >
                                        <span style={styles.sourceNum}>{String(i + 1).padStart(2, '0')}</span>
                                        <div>
                                            <p style={styles.sourceTitle}>{signal.title}</p>
                                            <p style={styles.sourceSummary}>{signal.summary.slice(0, 120)}...</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Bottom Sections */}
            <div style={styles.grid}>
                {/* Notion Scripts */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Scripts from Notion</h2>
                    <p style={styles.cardDescription}>
                        Latest video scripts and content drafts synced from your Notion workspace.
                    </p>
                    <div style={styles.comingSoon}>
                        <p style={styles.comingSoonText}>Awaiting Notion API</p>
                        <p style={styles.comingSoonSub}>Will pull scripts, topics, and drafts</p>
                    </div>
                </div>

                {/* Outreach */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Brand Outreach</h2>
                    <p style={styles.cardDescription}>
                        Automated partnership discovery and email outreach agent.
                    </p>
                    <div style={styles.comingSoon}>
                        <p style={styles.comingSoonText}>Phase 2</p>
                        <p style={styles.comingSoonSub}>Activate after content pipeline is running</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    main: {
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        padding: '40px 32px 80px',
        maxWidth: '960px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '32px',
    },
    title: {
        fontSize: '22px',
        fontWeight: 600,
        letterSpacing: '1.5px',
        textTransform: 'uppercase' as const,
        margin: '0 0 6px',
    },
    date: {
        fontSize: '13px',
        color: '#555',
        margin: 0,
    },
    statusBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        padding: '16px 20px',
        background: '#0a0a0a',
        border: '1px solid #151515',
        borderRadius: '8px',
        marginBottom: '24px',
    },
    statusItem: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '4px',
    },
    statusLabel: {
        fontSize: '10px',
        color: '#444',
        letterSpacing: '1.5px',
        fontWeight: 500,
    },
    statusValue: {
        fontSize: '13px',
        color: '#888',
        fontWeight: 500,
    },
    statusDivider: {
        width: '1px',
        height: '28px',
        background: '#1a1a1a',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px',
    },
    card: {
        background: '#0a0a0a',
        border: '1px solid #151515',
        borderRadius: '8px',
        padding: '24px',
    },
    cardTitle: {
        fontSize: '14px',
        fontWeight: 600,
        margin: '0 0 8px',
        color: '#fff',
    },
    cardDescription: {
        fontSize: '12px',
        color: '#555',
        lineHeight: '1.6',
        margin: '0 0 20px',
    },
    generateBtn: {
        background: '#fff',
        color: '#000',
        border: 'none',
        padding: '10px 24px',
        fontSize: '13px',
        fontWeight: 500,
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
    },
    loadingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '1.5px solid #333',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingLabel: {
        fontSize: '12px',
        color: '#666',
    },
    errorText: {
        color: '#ff4444',
        fontSize: '12px',
        marginTop: '10px',
        marginBottom: 0,
    },
    comingSoon: {
        padding: '12px 16px',
        background: '#050505',
        borderRadius: '4px',
        border: '1px dashed #1a1a1a',
    },
    comingSoonText: {
        fontSize: '12px',
        color: '#444',
        margin: '0 0 2px',
        fontWeight: 500,
    },
    comingSoonSub: {
        fontSize: '11px',
        color: '#333',
        margin: 0,
    },
    briefSection: {
        marginBottom: '24px',
    },
    briefHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    briefTitle: {
        fontSize: '16px',
        fontWeight: 600,
        margin: 0,
    },
    briefMeta: {
        display: 'flex',
        gap: '16px',
        fontSize: '11px',
        color: '#444',
    },
    briefContent: {
        background: '#0a0a0a',
        border: '1px solid #151515',
        borderRadius: '8px',
        padding: '28px 24px',
        marginBottom: '16px',
    },
    h2: {
        fontSize: '17px',
        fontWeight: 600,
        margin: '28px 0 10px',
        color: '#fff',
    },
    h3: {
        fontSize: '14px',
        fontWeight: 600,
        margin: '20px 0 8px',
        color: '#ccc',
    },
    h4: {
        fontSize: '12px',
        fontWeight: 600,
        margin: '16px 0 6px',
        color: '#888',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
    },
    bold: {
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '1.8',
        color: '#ddd',
        margin: '4px 0',
    },
    bullet: {
        fontSize: '13px',
        lineHeight: '1.8',
        color: '#aaa',
        paddingLeft: '16px',
        margin: '2px 0',
        position: 'relative' as const,
    },
    paragraph: {
        fontSize: '13px',
        lineHeight: '1.8',
        color: '#aaa',
        margin: '4px 0',
    },
    sourcesSection: {
        background: '#0a0a0a',
        border: '1px solid #151515',
        borderRadius: '8px',
        padding: '20px 24px',
    },
    sourcesTitle: {
        fontSize: '12px',
        fontWeight: 600,
        color: '#555',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        margin: '0 0 12px',
    },
    sourcesList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
    },
    sourceCard: {
        display: 'flex',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '4px',
        textDecoration: 'none',
        color: '#aaa',
        border: '1px solid #111',
    },
    sourceNum: {
        fontSize: '11px',
        color: '#333',
        fontWeight: 600,
        paddingTop: '2px',
        minWidth: '20px',
    },
    sourceTitle: {
        fontSize: '13px',
        color: '#999',
        margin: '0 0 2px',
        fontWeight: 500,
    },
    sourceSummary: {
        fontSize: '11px',
        color: '#444',
        margin: 0,
        lineHeight: '1.5',
    },
};
