import { env } from "@/lib/env";

export default function HomePage() {
  const { NEXT_PUBLIC_APP_URL } = env();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Billboard App</h1>
      <p>Vercel-ready Next.js baseline.</p>
      <p>App URL: {NEXT_PUBLIC_APP_URL}</p>
    </main>
  );
}
