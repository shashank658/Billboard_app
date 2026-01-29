import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  attachClerkUserId,
  findUserByClerkId,
  findUserByEmail,
  findUserByEmailInsensitive,
} from "@/lib/data-access/users";

export const requireActiveUser = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  let dbUser = await findUserByClerkId(userId);

  if (!dbUser) {
    const primaryEmailId = clerkUser.primaryEmailAddressId;
    const primaryEmail =
      clerkUser.emailAddresses.find((email) => email.id === primaryEmailId)?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress;
    const normalizedEmail = primaryEmail?.trim().toLowerCase();
    if (normalizedEmail) {
      const matched =
        (await findUserByEmail(normalizedEmail)) ??
        (await findUserByEmailInsensitive(normalizedEmail));
      if (matched) {
        dbUser = await attachClerkUserId({ userId: matched.id, clerkUserId: userId });
      }
    }
  }

  if (!dbUser) {
    redirect("/unauthorized");
  }

  if (dbUser.deletedAt || dbUser.status !== "ACTIVE") {
    redirect("/inactive");
  }

  return { clerkUser, dbUser };
};

export const requireAdminUser = async () => {
  const session = await requireActiveUser();
  if (session.dbUser.userType !== "ADMIN") {
    redirect("/unauthorized");
  }
  return session;
};
