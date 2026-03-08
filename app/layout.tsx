import './globals.css';

export const metadata = {
    title: 'RRG OS — Intelligence Dashboard',
    description: 'Automated content intelligence powered by Claude and Exa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
