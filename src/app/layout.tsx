import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "Agentic GTM Canvas",
  description: "Agentic Go To Market Canvas using Gemini",
  openGraph: {
    title: "Agentic GTM Canvas",
    description: "Orchestrating full-scale agentic infrastructure for B2B product strategy",
    url: "https://agentic-gtm-canvas.vercel.app", // Ensure this matches Vercel URL
    siteName: "Agentic GTM Canvas",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agentic GTM Canvas Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic GTM Canvas",
    description: "Orchestrating full-scale agentic infrastructure for B2B product strategy",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}
      >
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
