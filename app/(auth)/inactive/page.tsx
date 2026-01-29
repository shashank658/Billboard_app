export default function InactivePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-md rounded-3xl border bg-white/90 p-8 text-center shadow-glow">
        <h1 className="font-serif text-3xl text-foreground">Account inactive</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account is currently inactive. Please contact an administrator for access.
        </p>
      </div>
    </main>
  );
}
