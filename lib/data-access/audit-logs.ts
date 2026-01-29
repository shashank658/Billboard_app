import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { AuditAction } from "@/types/user";

type DbClient = typeof db;

export const createAuditLog = async (
  input: {
  actorUserId: string;
  action: AuditAction;
  targetUserId?: string | null;
  },
  conn: DbClient = db
) => {
  const [created] = await conn
    .insert(auditLogs)
    .values({
      actorUserId: input.actorUserId,
      action: input.action,
      targetUserId: input.targetUserId ?? null,
    })
    .returning();

  return created;
};
