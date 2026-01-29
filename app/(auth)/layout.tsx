export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border bg-white/90 p-8 shadow-glow backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Billboard</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your company credentials to continue.
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}
