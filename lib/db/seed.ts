import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { billboards, users } from "@/lib/db/schema";
import { env } from "@/lib/env";

const seedBillboards = [
  {
    title: "Welcome to Billboard",
    description: "Your first billboard is ready to edit.",
  },
  {
    title: "Launch Checklist",
    description: "Add pricing, messaging, and CTA before launch.",
  },
];

const seedAdmin = async () => {
  const { SEED_ADMIN_EMAIL, SEED_ADMIN_NAME } = env();
  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_NAME) {
    return;
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, SEED_ADMIN_EMAIL.toLowerCase()))
    .limit(1)
    .then((rows) => rows[0]);

  if (!existing) {
    await db.insert(users).values({
      email: SEED_ADMIN_EMAIL.toLowerCase(),
      fullName: SEED_ADMIN_NAME,
      userType: "ADMIN",
      status: "ACTIVE",
      activatedAt: new Date(),
    });
  }
};

const runSeed = async (): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx.delete(billboards);
    await tx.insert(billboards).values(seedBillboards);
  });
  await seedAdmin();
};

runSeed()
  .then(() => {
    console.log("Seed data inserted.");
  })
  .catch((error) => {
    console.error("Failed to seed database.", error);
    process.exitCode = 1;
  });
