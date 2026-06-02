import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/provider/provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | GetAvails",
    default: "GetAvails - Premium Artist & Venue Booking Marketplace",
  },
  description: "GetAvails is the premier marketplace to discover and book world-class artists, musicians, and top-tier venues for your next corporate event or festival.",
  keywords: ["artist booking", "book venues", "event planning", "musicians", "corporate events", "festival booking", "GetAvails"],
  openGraph: {
    title: "GetAvails - Premium Artist & Venue Booking Marketplace",
    description: "Discover and book world-class artists and top-tier venues for your next event with GetAvails.",
    url: "https://www.getavails.com",
    siteName: "GetAvails",
    images: [
      {
        url: "https://www.getavails.com/og-image.jpg", // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: "GetAvails Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetAvails - Premium Artist & Venue Booking Marketplace",
    description: "Discover and book world-class artists and top-tier venues for your next event with GetAvails.",
    images: ["https://www.getavails.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
          <Toaster
            richColors
            position="top-center"
            closeButton
            expand={false}
            duration={2000}
            visibleToasts={1}
            theme="dark"
          />
        </Providers>
      </body>
    </html>
  );
}
