import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Animal Gallery Demo',
  description:
    'Choose an animal to view a bento gallery with scientific info, or upload an image to see metadata.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark" suppressHydrationWarning lang="en">
      <head />
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <Providers
          themeProps={{
            attribute: 'class',
            defaultTheme: 'dark',
            forcedTheme: 'dark',
          }}
        >
          <main className="container mx-auto max-w-7xl px-6 py-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
