import { db } from "@/lib/db";
import { billboards } from "@/lib/db/schema";

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

const runSeed = async (): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx.delete(billboards);
    await tx.insert(billboards).values(seedBillboards);
  });
};

runSeed()
  .then(() => {
    console.log("Seed data inserted.");
  })
  .catch((error) => {
    console.error("Failed to seed database.", error);
    process.exitCode = 1;
  });
