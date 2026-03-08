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

    return (
        <main style={styles.main}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.logoRow}>
                    <div style={styles.logoDot} />
                    <h1 style={styles.title}>RRG OS</h1>
                </div>
                <p style={styles.subtitle}>Automated Intelligence Dashboard</p>
            </div>

            {/* Generate Button */}
            {!briefData && !loading && (
                <div style={styles.ctaContainer}>
                    <button onClick={generateBrief} style={styles.generateBtn}>
                        ⚡ Generate Today's Brief
                    </button>
                    <p style={styles.ctaHint}>
                        Scans AI, economy, crypto, and content trends — then synthesizes your morning brief.
                    </p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner} />
                    <p style={styles.loadingText}>Scanning the world...</p>
                    <p style={styles.loadingSubtext}>
                        Exa is crawling 5 categories → Claude is synthesizing your brief
                    </p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div style={styles.errorContainer}>
                    <p style={styles.errorText}>❌ {error}</p>
                    <button onClick={generateBrief} style={styles.retryBtn}>
                        Try Again
                    </button>
                </div>
            )}

            {/* Brief Display */}
            {briefData && (
                <div style={styles.briefContainer}>
                    {/* Meta */}
                    <div style={styles.metaRow}>
                        <span style={styles.metaTag}>
                            {briefData.signalCount} signals scanned
                        </span>
                        <span style={styles.metaTime}>
                            {new Date(briefData.timestamp).toLocaleString()}
                        </span>
                    </div>

                    {/* Brief Content */}
                    <div style={styles.briefContent}>
                        {briefData.brief.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) {
                                return <h2 key={i} style={styles.briefH2}>{line.replace('# ', '')}</h2>;
                            }
                            if (line.startsWith('## ')) {
                                return <h3 key={i} style={styles.briefH3}>{line.replace('## ', '')}</h3>;
                            }
                            if (line.startsWith('### ')) {
                                return <h4 key={i} style={styles.briefH4}>{line.replace('### ', '')}</h4>;
                            }
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return <p key={i} style={styles.briefBold}>{line.replace(/\*\*/g, '')}</p>;
                            }
                            if (line.startsWith('- ')) {
                                return <p key={i} style={styles.briefBullet}>• {line.replace('- ', '')}</p>;
                            }
                            if (line.trim() === '') {
                                return <div key={i} style={{ height: '12px' }} />;
                            }
                            return <p key={i} style={styles.briefParagraph}>{line}</p>;
                        })}
                    </div>

                    {/* Source Signals */}
                    {briefData.signals.length > 0 && (
                        <div style={styles.sourcesSection}>
                            <h4 style={styles.sourcesTitle}>📡 Source Signals</h4>
                            {briefData.signals.map((signal, i) => (
                                <a
                                    key={i}
                                    href={signal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.sourceLink}
                                >
                                    <span style={styles.sourceIndex}>{i + 1}</span>
                                    <span style={styles.sourceName}>{signal.title}</span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Regenerate */}
                    <button onClick={generateBrief} style={styles.regenerateBtn}>
                        ↻ Regenerate Brief
                    </button>
                </div>
            )}

            {/* Cron Schedule Footer */}
            <div style={styles.footer}>
                <p style={styles.footerLabel}>Automated Schedule (MST)</p>
                <div style={styles.cronRow}>
                    <span style={styles.cronItem}>🌍 3:00 AM — Scan World</span>
                    <span style={styles.cronItem}>📊 6:00 AM — Scan Content</span>
                    <span style={styles.cronItem}>📋 7:00 AM — Generate Brief</span>
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
        padding: '40px 24px',
        maxWidth: '720px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '48px',
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
    },
    logoDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#00ff88',
        boxShadow: '0 0 12px #00ff8866',
    },
    title: {
        fontSize: '28px',
        fontWeight: 700,
        letterSpacing: '-0.5px',
        margin: 0,
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
        paddingLeft: '22px',
    },
    ctaContainer: {
        textAlign: 'center' as const,
        padding: '80px 0',
    },
    generateBtn: {
        background: '#fff',
        color: '#000',
        border: 'none',
        padding: '16px 40px',
        fontSize: '16px',
        fontWeight: 600,
        borderRadius: '8px',
        cursor: 'pointer',
        letterSpacing: '-0.3px',
        transition: 'opacity 0.2s',
    },
    ctaHint: {
        color: '#555',
        fontSize: '13px',
        marginTop: '16px',
        lineHeight: '1.5',
    },
    loadingContainer: {
        textAlign: 'center' as const,
        padding: '80px 0',
    },
    spinner: {
        width: '32px',
        height: '32px',
        border: '2px solid #333',
        borderTopColor: '#fff',
        borderRadius: '50%',
        margin: '0 auto 20px',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '8px',
    },
    loadingSubtext: {
        fontSize: '13px',
        color: '#666',
    },
    errorContainer: {
        textAlign: 'center' as const,
        padding: '60px 0',
    },
    errorText: {
        color: '#ff4444',
        fontSize: '15px',
        marginBottom: '16px',
    },
    retryBtn: {
        background: 'transparent',
        color: '#fff',
        border: '1px solid #333',
        padding: '10px 24px',
        fontSize: '14px',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    briefContainer: {
        borderTop: '1px solid #1a1a1a',
        paddingTop: '32px',
    },
    metaRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
    },
    metaTag: {
        background: '#111',
        border: '1px solid #222',
        padding: '4px 12px',
        borderRadius: '100px',
        fontSize: '12px',
        color: '#888',
    },
    metaTime: {
        fontSize: '12px',
        color: '#555',
    },
    briefContent: {
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: '12px',
        padding: '28px 24px',
        marginBottom: '24px',
    },
    briefH2: {
        fontSize: '20px',
        fontWeight: 700,
        marginBottom: '16px',
        marginTop: '24px',
        color: '#fff',
    },
    briefH3: {
        fontSize: '16px',
        fontWeight: 600,
        marginBottom: '12px',
        marginTop: '20px',
        color: '#ccc',
    },
    briefH4: {
        fontSize: '14px',
        fontWeight: 600,
        marginBottom: '8px',
        marginTop: '16px',
        color: '#aaa',
    },
    briefBold: {
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#eee',
        margin: '4px 0',
    },
    briefBullet: {
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#ccc',
        paddingLeft: '12px',
        margin: '4px 0',
    },
    briefParagraph: {
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#ccc',
        margin: '4px 0',
    },
    sourcesSection: {
        borderTop: '1px solid #1a1a1a',
        paddingTop: '20px',
        marginBottom: '24px',
    },
    sourcesTitle: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#888',
        marginBottom: '12px',
    },
    sourceLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderRadius: '6px',
        textDecoration: 'none',
        color: '#aaa',
        fontSize: '13px',
        transition: 'background 0.15s',
        marginBottom: '4px',
    },
    sourceIndex: {
        color: '#555',
        fontSize: '11px',
        fontWeight: 600,
        width: '18px',
    },
    sourceName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    },
    regenerateBtn: {
        background: 'transparent',
        color: '#666',
        border: '1px solid #222',
        padding: '10px 24px',
        fontSize: '13px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'block',
        margin: '0 auto',
    },
    footer: {
        marginTop: '60px',
        borderTop: '1px solid #111',
        paddingTop: '24px',
        textAlign: 'center' as const,
    },
    footerLabel: {
        fontSize: '11px',
        color: '#444',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        marginBottom: '12px',
    },
    cronRow: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap' as const,
    },
    cronItem: {
        fontSize: '12px',
        color: '#555',
    },
};
