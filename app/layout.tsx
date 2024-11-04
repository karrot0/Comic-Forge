import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Manhwa Project Manager',
  description: 'Modern dashboard for managing manhwa projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="min-h-screen">
            <Navigation />
            <main className="h-[calc(100vh-4rem)]">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}