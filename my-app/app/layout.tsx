import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { PushSubscribeButton } from "@/components/PushSubscribeButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learnly",
  description: "Apprendre en s'amusant",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Learnly",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/sw.js');
                }
              `,
            }}
          />
        </head>
        <body className="min-h-full flex flex-col">
          <ThemeProvider>
            <PushSubscribeButton />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}