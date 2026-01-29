import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { attachClerkUserId, findUserByClerkId, findUserByEmail } from "@/lib/data-access/users";

export const requireActiveUser = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  let dbUser = await findUserByClerkId(userId);

  if (!dbUser) {
    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase();
    if (primaryEmail) {
      const matched = await findUserByEmail(primaryEmail);
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
