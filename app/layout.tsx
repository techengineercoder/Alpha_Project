import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/provider/provider";
import Message from "@/components/home/message";
import { headers } from "next/headers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const routeTitles: Record<string, string> = {
  "/": "Premium Artist & Venue Booking Marketplace",
  "/about": "About Us",
  "/careers": "Careers",
  "/contact": "Contact Us",
  "/cookie-policy": "Cookie Policy",
  "/press": "Press & Media",
  "/privacy-policy": "Privacy Policy",
  "/solution": "Solutions",
  "/services": "Our Services",
  "/search": "Search Artists & Venues",
  "/search-history": "Search History",
  "/favorites": "My Favorites",
  "/login": "Sign In",
  "/register": "Sign Up",
  "/register-success": "Registration Successful",
  "/forgot-password": "Forgot Password",
  "/reset-password": "Reset Password",
  "/verify": "Verify Account",
  "/dashboard": "Dashboard",
  "/dashboard/team-management": "Team Management",
  "/venue/calendar": "Venue Calendar",
  "/talent-buyer/offers": "My Offers",
  "/artist/dashboard": "Artist Dashboard",
  "/artist/bookings": "My Bookings",
  "/artist/availability": "My Availability",
  "/artist/messages": "My Messages",
  "/artist/offers": "My Offers",
  "/artist/settings": "Settings",
  "/artist/gigs": "My Gigs",
  "/artist/profile": "My Profile",
  "/agent/roster": "Roster Management",
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  let pageTitle = routeTitles[pathname];

  if (!pageTitle) {
    if (pathname.startsWith("/venue/")) {
      pageTitle = "Venue Details";
    } else if (pathname.startsWith("/search/")) {
      pageTitle = "Artist Details";
    } else if (pathname.startsWith("/favorites/share/")) {
      pageTitle = "Shared Favorites";
    } else if (pathname.startsWith("/favorites/venue/share/")) {
      pageTitle = "Shared Venues";
    } else {
      pageTitle = "Premium Artist & Venue Booking Marketplace";
    }
  }

  const finalTitle = pathname === "/" ? `GetAvails - ${pageTitle}` : `${pageTitle} | GetAvails`;

  return {
    title: finalTitle,
    description: "GetAvails is the premier marketplace to discover and book world-class artists, musicians, and top-tier venues for your next corporate event or festival.",
    keywords: ["artist booking", "book venues", "event planning", "musicians", "corporate events", "festival booking", "GetAvails"],
    openGraph: {
      title: finalTitle,
      description: "Discover and book world-class artists and top-tier venues for your next event with GetAvails.",
      url: "https://www.getavails.com",
      siteName: "GetAvails",
      images: [
        {
          url: "https://www.getavails.com/og-image.jpg",
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
      title: finalTitle,
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
}

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
            position="bottom-left"
            closeButton
            expand={false}
            duration={2000}
            visibleToasts={1}
            theme="dark"
          />
          <Message />
        </Providers>
      </body>
    </html>
  );
}
