import Link from "next/link";

import { requireActiveUser } from "@/lib/services/auth";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { dbUser } = await requireActiveUser();

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Billboard</p>
            <h1 className="font-serif text-xl">Operations Console</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link className="font-medium text-foreground/80 hover:text-foreground" href="/dashboard">
              Overview
            </Link>
            {dbUser.userType === "ADMIN" ? (
              <Link className="font-medium text-foreground/80 hover:text-foreground" href="/users">
                Users
              </Link>
            ) : null}
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
