import { z } from "zod";

import { userStatuses, userTypes } from "@/types/user";

export const createUserSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email(),
  userType: z.enum(userTypes),
  status: z.enum(userStatuses),
});

export const updateUserSchema = z.object({
  userId: z.string().uuid(),
  userType: z.enum(userTypes),
  status: z.enum(userStatuses),
});
