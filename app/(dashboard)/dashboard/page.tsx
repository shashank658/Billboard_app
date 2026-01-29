import { requireActiveUser } from "@/lib/services/auth";

export default async function DashboardPage() {
  const { dbUser } = await requireActiveUser();

  return (
    <section className="rounded-3xl border bg-white/90 p-8 shadow-glow">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Dashboard</p>
      <h2 className="mt-2 font-serif text-3xl text-foreground">Welcome, {dbUser.fullName}</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Your account is active and ready. Use the Users section to manage access.
      </p>
    </section>
  );
}
