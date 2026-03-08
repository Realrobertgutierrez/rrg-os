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
            <div style={styles.header}>
                <h1 style={styles.title}>RRG OS</h1>
            </div>

            {!briefData && !loading && (
                <div style={styles.ctaContainer}>
                    <button onClick={generateBrief} style={styles.generateBtn}>
                        Generate Brief
                    </button>
                </div>
            )}

            {loading && (
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner} />
                    <p style={styles.loadingText}>Scanning...</p>
                </div>
            )}

            {error && (
                <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                    <button onClick={generateBrief} style={styles.retryBtn}>
                        Retry
                    </button>
                </div>
            )}

            {briefData && (
                <div style={styles.briefContainer}>
                    <div style={styles.metaRow}>
                        <span style={styles.metaTag}>{briefData.signalCount} signals</span>
                        <span style={styles.metaTime}>
                            {new Date(briefData.timestamp).toLocaleString()}
                        </span>
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
                                return <p key={i} style={styles.bullet}>{line.replace('- ', '— ')}</p>;
                            }
                            if (line.trim() === '') {
                                return <div key={i} style={{ height: '12px' }} />;
                            }
                            return <p key={i} style={styles.paragraph}>{line}</p>;
                        })}
                    </div>

                    {briefData.signals.length > 0 && (
                        <div style={styles.sourcesSection}>
                            <p style={styles.sourcesLabel}>Sources</p>
                            {briefData.signals.map((signal, i) => (
                                <a
                                    key={i}
                                    href={signal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.sourceLink}
                                >
                                    {signal.title}
                                </a>
                            ))}
                        </div>
                    )}

                    <button onClick={generateBrief} style={styles.regenerateBtn}>
                        Regenerate
                    </button>
                </div>
            )}
        </main>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    main: {
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        padding: '60px 24px',
        maxWidth: '640px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '60px',
    },
    title: {
        fontSize: '20px',
        fontWeight: 500,
        letterSpacing: '2px',
        textTransform: 'uppercase' as const,
        margin: 0,
        color: '#fff',
    },
    ctaContainer: {
        paddingTop: '120px',
        textAlign: 'center' as const,
    },
    generateBtn: {
        background: '#fff',
        color: '#000',
        border: 'none',
        padding: '14px 36px',
        fontSize: '14px',
        fontWeight: 500,
        borderRadius: '4px',
        cursor: 'pointer',
        letterSpacing: '0.5px',
    },
    loadingContainer: {
        textAlign: 'center' as const,
        paddingTop: '120px',
    },
    spinner: {
        width: '20px',
        height: '20px',
        border: '1.5px solid #333',
        borderTopColor: '#fff',
        borderRadius: '50%',
        margin: '0 auto 20px',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        fontSize: '13px',
        color: '#666',
    },
    errorContainer: {
        textAlign: 'center' as const,
        paddingTop: '80px',
    },
    errorText: {
        color: '#888',
        fontSize: '13px',
        marginBottom: '16px',
    },
    retryBtn: {
        background: 'transparent',
        color: '#fff',
        border: '1px solid #333',
        padding: '8px 20px',
        fontSize: '13px',
        borderRadius: '4px',
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
        marginBottom: '32px',
    },
    metaTag: {
        fontSize: '11px',
        color: '#555',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
    },
    metaTime: {
        fontSize: '11px',
        color: '#333',
    },
    briefContent: {
        marginBottom: '40px',
    },
    h2: {
        fontSize: '18px',
        fontWeight: 600,
        margin: '32px 0 12px',
        color: '#fff',
    },
    h3: {
        fontSize: '15px',
        fontWeight: 600,
        margin: '24px 0 8px',
        color: '#ccc',
    },
    h4: {
        fontSize: '13px',
        fontWeight: 600,
        margin: '20px 0 6px',
        color: '#999',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
    },
    bold: {
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '1.8',
        color: '#eee',
        margin: '4px 0',
    },
    bullet: {
        fontSize: '14px',
        lineHeight: '1.8',
        color: '#aaa',
        paddingLeft: '8px',
        margin: '2px 0',
    },
    paragraph: {
        fontSize: '14px',
        lineHeight: '1.8',
        color: '#aaa',
        margin: '4px 0',
    },
    sourcesSection: {
        borderTop: '1px solid #111',
        paddingTop: '24px',
        marginBottom: '32px',
    },
    sourcesLabel: {
        fontSize: '11px',
        color: '#444',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        marginBottom: '12px',
    },
    sourceLink: {
        display: 'block',
        padding: '6px 0',
        textDecoration: 'none',
        color: '#555',
        fontSize: '13px',
        borderBottom: '1px solid #0a0a0a',
    },
    regenerateBtn: {
        background: 'transparent',
        color: '#444',
        border: '1px solid #1a1a1a',
        padding: '8px 20px',
        fontSize: '12px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'block',
        margin: '0 auto',
    },
};
