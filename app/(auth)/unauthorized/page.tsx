export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-md rounded-3xl border bg-white/90 p-8 text-center shadow-glow">
        <h1 className="font-serif text-3xl text-foreground">Access denied</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    </main>
  );
}
