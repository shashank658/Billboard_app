import { clerkClient } from "@clerk/nextjs/server";

import { createAuditLog } from "@/lib/data-access/audit-logs";
import {
  createUserRecord,
  findUserByEmail,
  findUserById,
  listUsers,
  softDeleteUser,
  updateUserRecord,
} from "@/lib/data-access/users";
import { db } from "@/lib/db";
import { UserStatus, UserType } from "@/types/user";

export const getUsers = async () => {
  return listUsers();
};

export const inviteUser = async (input: {
  fullName: string;
  email: string;
  userType: UserType;
  status: UserStatus;
  actorUserId: string;
}) => {
  const existing = await findUserByEmail(input.email.toLowerCase());
  if (existing) {
    throw new Error("Email already exists.");
  }

  const client = await clerkClient();
  const invitation = await client.invitations.createInvitation({
    emailAddress: input.email.toLowerCase(),
    publicMetadata: {
      userType: input.userType,
      status: input.status,
    },
  });

  return db.transaction(async (tx) => {
    const conn = tx as typeof db;
    const created = await createUserRecord(
      {
        fullName: input.fullName,
        email: input.email,
        userType: input.userType,
        status: input.status,
        clerkInvitationId: invitation.id,
      },
      conn
    );

    await createAuditLog(
      {
        actorUserId: input.actorUserId,
        action: "USER_CREATED",
        targetUserId: created.id,
      },
      conn
    );

    return created;
  });
};

export const updateUser = async (input: {
  userId: string;
  userType: UserType;
  status: UserStatus;
  actorUserId: string;
}) => {
  const existing = await findUserById(input.userId);
  if (!existing) {
    throw new Error("User not found.");
  }

  const updated = await db.transaction(async (tx) => {
    const conn = tx as typeof db;
    const result = await updateUserRecord(
      {
        userId: input.userId,
        userType: input.userType,
        status: input.status,
      },
      conn
    );

    if (!result) {
      throw new Error("User update failed.");
    }

    if (existing.userType !== result.userType) {
      await createAuditLog(
        {
          actorUserId: input.actorUserId,
          action: "USER_TYPE_CHANGED",
          targetUserId: result.id,
        },
        conn
      );
    }

    if (existing.status !== result.status) {
      await createAuditLog(
        {
          actorUserId: input.actorUserId,
          action: result.status === "ACTIVE" ? "USER_ACTIVATED" : "USER_DEACTIVATED",
          targetUserId: result.id,
        },
        conn
      );
    }

    return result;
  });

  if (updated.clerkUserId) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(updated.clerkUserId, {
      publicMetadata: {
        userType: updated.userType,
        status: updated.status,
      },
    });
  }

  return updated;
};

export const deleteUser = async (input: { userId: string; actorUserId: string }) => {
  const existing = await findUserById(input.userId);
  if (!existing) {
    throw new Error("User not found.");
  }

  const updated = await db.transaction(async (tx) => {
    const conn = tx as typeof db;
    const result = await softDeleteUser(input.userId, conn);
    if (!result) {
      throw new Error("User delete failed.");
    }

    await createAuditLog(
      {
        actorUserId: input.actorUserId,
        action: "USER_DELETED",
        targetUserId: result.id,
      },
      conn
    );

    return result;
  });

  return updated;
};
