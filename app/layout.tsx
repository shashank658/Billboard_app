import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
