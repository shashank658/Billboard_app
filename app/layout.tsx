import type { Metadata } from "next";
import { Space_Grotesk, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "@/app/globals.css";
import { cn } from "@/lib/utils";

const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Billboard App",
  description: "Barebone Next.js app ready for Vercel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen antialiased", fontSans.variable, fontSerif.variable)}>
        <ClerkProvider signInUrl="/sign-in">
          <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.8),transparent_45%)]" />
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
