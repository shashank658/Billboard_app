export const userTypes = ["ADMIN", "USER"] as const;
export type UserType = (typeof userTypes)[number];

export const userStatuses = ["ACTIVE", "INACTIVE"] as const;
export type UserStatus = (typeof userStatuses)[number];

export const auditActions = [
  "USER_CREATED",
  "USER_ACTIVATED",
  "USER_DEACTIVATED",
  "USER_TYPE_CHANGED",
  "USER_DELETED",
] as const;
export type AuditAction = (typeof auditActions)[number];
