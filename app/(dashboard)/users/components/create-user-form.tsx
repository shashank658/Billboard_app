"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserSchema } from "@/lib/validation/users";
import { userStatuses, userTypes } from "@/types/user";

import { ActionState, createUserAction } from "../actions";

type FormValues = {
  fullName: string;
  email: string;
  userType: (typeof userTypes)[number];
  status: (typeof userStatuses)[number];
};

const initialState: ActionState = { status: "idle" };

export const CreateUserForm = () => {
  const [state, formAction] = useFormState(createUserAction, initialState);
  const {
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { userType: "USER", status: "ACTIVE" },
  });

  useEffect(() => {
    if (state.status === "success") {
      reset({ fullName: "", email: "", userType: "USER", status: "ACTIVE" });
    }
  }, [state.status, reset]);

  return (
    <form action={formAction} className="grid gap-6 rounded-3xl border bg-white/90 p-6 shadow-glow">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Invite user</p>
        <h2 className="mt-2 font-serif text-2xl text-foreground">Add a teammate</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a user and Clerk will email the password setup link.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" placeholder="Alex Morgan" {...register("fullName")} />
          {errors.fullName ? <p className="text-xs text-destructive">{errors.fullName.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="alex@company.com" {...register("email")} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="userType">User type</Label>
          <select
            id="userType"
            className="h-11 rounded-2xl border border-input bg-white/80 px-4 text-sm"
            {...register("userType")}
          >
            {userTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="h-11 rounded-2xl border border-input bg-white/80 px-4 text-sm"
            {...register("status")}
          >
            {userStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-emerald-700"}>
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Invitations expire based on Clerk settings.
        </p>
        <Button type="submit">Send invite</Button>
      </div>
    </form>
  );
};
