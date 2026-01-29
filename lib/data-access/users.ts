import { and, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { UserStatus, UserType } from "@/types/user";

type DbClient = typeof db;

export const listUsers = async (conn: DbClient = db) => {
  return conn
    .select()
    .from(users)
    .where(isNull(users.deletedAt))
    .orderBy(desc(users.createdAt));
};

export const findUserByEmail = async (email: string, conn: DbClient = db) => {
  const normalized = email.trim().toLowerCase();
  return conn
    .select()
    .from(users)
    .where(and(eq(users.email, normalized), isNull(users.deletedAt)))
    .limit(1)
    .then((rows) => rows[0] ?? null);
};

export const findUserByEmailInsensitive = async (email: string, conn: DbClient = db) => {
  const normalized = email.trim().toLowerCase();
  return conn
    .select()
    .from(users)
    .where(and(eq(sql<string>`lower(${users.email})`, normalized), isNull(users.deletedAt)))
    .limit(1)
    .then((rows) => rows[0] ?? null);
};

export const findUserByClerkId = async (clerkUserId: string, conn: DbClient = db) => {
  return conn
    .select()
    .from(users)
    .where(and(eq(users.clerkUserId, clerkUserId), isNull(users.deletedAt)))
    .limit(1)
    .then((rows) => rows[0] ?? null);
};

export const findUserById = async (userId: string, conn: DbClient = db) => {
  return conn
    .select()
    .from(users)
    .where(and(eq(users.id, userId), isNull(users.deletedAt)))
    .limit(1)
    .then((rows) => rows[0] ?? null);
};

export const createUserRecord = async (
  input: {
  fullName: string;
  email: string;
  userType: UserType;
  status: UserStatus;
  clerkInvitationId?: string | null;
  },
  conn: DbClient = db
) => {
  const [created] = await conn
    .insert(users)
    .values({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      userType: input.userType,
      status: input.status,
      clerkInvitationId: input.clerkInvitationId ?? null,
      activatedAt: input.status === "ACTIVE" ? new Date() : null,
      deactivatedAt: input.status === "INACTIVE" ? new Date() : null,
    })
    .returning();

  return created;
};

export const updateUserRecord = async (
  input: {
  userId: string;
  userType: UserType;
  status: UserStatus;
  },
  conn: DbClient = db
) => {
  const [updated] = await conn
    .update(users)
    .set({
      userType: input.userType,
      status: input.status,
      activatedAt: input.status === "ACTIVE" ? new Date() : null,
      deactivatedAt: input.status === "INACTIVE" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, input.userId))
    .returning();

  return updated ?? null;
};

export const softDeleteUser = async (userId: string, conn: DbClient = db) => {
  const [updated] = await conn
    .update(users)
    .set({
      status: "INACTIVE",
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updated ?? null;
};

export const attachClerkUserId = async (
  input: { userId: string; clerkUserId: string },
  conn: DbClient = db
) => {
  const [updated] = await conn
    .update(users)
    .set({ clerkUserId: input.clerkUserId, updatedAt: new Date() })
    .where(eq(users.id, input.userId))
    .returning();

  return updated ?? null;
};
