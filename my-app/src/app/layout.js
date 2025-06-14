import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "MetroConnect – Smart Metro Journey Planner",
    template: "%s | MetroConnect",
  },
  description:
    "Plan your metro journey with MetroConnect. Find stations, routes, gates, fares and train schedules in one place.",
  keywords: [
    "metro",
    "train planner",
    "station gates",
    "metro schedule",
    "metro fare",
    "Next.js metro app",
  ],
  authors: [{ name: "MetroConnect Dev Team" }],
  creator: "MetroConnect Team",

  openGraph: {
    title: "MetroConnect – Smart Metro Journey Planner",
    description:
      "MetroConnect helps you plan metro travel with routes, fare, timings, and station details.",
    url: "https://yourdomain.com",
    siteName: "MetroConnect",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MetroConnect – Smart Metro Journey Planner",
    description:
      "MetroConnect helps you plan metro travel with routes, fare, timings, and station details.",
    creator: "@yourhandle",
  },

};

// ✅ Move themeColor to viewport
export const viewport = {
  themeColor: "#1E40AF", // Tailwind's blue-800
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "MetroConnect",
        url: "https://yourdomain.com",
        applicationCategory: "TravelApplication",
        operatingSystem: "All",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "172",
        },
      })}
      </script>

    </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
