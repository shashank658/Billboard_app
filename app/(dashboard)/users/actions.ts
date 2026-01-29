"use server";

import { revalidatePath } from "next/cache";

import { requireAdminUser } from "@/lib/services/auth";
import { deleteUser, inviteUser, updateUser } from "@/lib/services/users";
import { createUserSchema, updateUserSchema } from "@/lib/validation/users";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const parseFormData = (formData: FormData) => Object.fromEntries(formData.entries());

export const createUserAction = async (_prevState: ActionState, formData: FormData) => {
  const { dbUser } = await requireAdminUser();
  const parsed = createUserSchema.safeParse(parseFormData(formData));

  if (!parsed.success) {
    return { status: "error", message: "Please check the form fields and try again." };
  }

  try {
    await inviteUser({
      ...parsed.data,
      actorUserId: dbUser.id,
    });
    revalidatePath("/users");
    return { status: "success", message: "Invitation sent." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to invite user.";
    return { status: "error", message };
  }
};

export const updateUserAction = async (formData: FormData) => {
  const { dbUser } = await requireAdminUser();
  const parsed = updateUserSchema.safeParse(parseFormData(formData));

  if (!parsed.success) {
    throw new Error("Invalid input.");
  }

  await updateUser({ ...parsed.data, actorUserId: dbUser.id });
  revalidatePath("/users");
};

export const deleteUserAction = async (formData: FormData) => {
  const { dbUser } = await requireAdminUser();
  const userId = formData.get("userId");

  if (typeof userId !== "string") {
    throw new Error("Invalid user.");
  }

  await deleteUser({ userId, actorUserId: dbUser.id });
  revalidatePath("/users");
};
