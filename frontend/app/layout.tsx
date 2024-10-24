import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import UserProvider from "@/components/UserProvider";
import SessionWrapper from "@/components/SessionWrapper";
import Script from 'next/script';  // Add this import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TravelEase",
  description: "Created by DRJ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <SessionWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              {/* Add Google Maps Script here, after the main content */}
              <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="afterInteractive"
              />
            </ThemeProvider>
          </SessionWrapper>
        </UserProvider>
      </body>
    </html>
  );
}