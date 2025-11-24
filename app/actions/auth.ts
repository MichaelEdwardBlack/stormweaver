"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginUser(initialState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error).properties;
    const errors: string[] = [];
    if (treeErrors?.password) errors.push(...treeErrors.password.errors);
    if (treeErrors?.email) errors.push(...treeErrors.email.errors);
    return {
      errors: errors,
    };
  }
}

const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export async function registerUser(initialState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error).properties;
    const errors: string[] = [];
    if (treeErrors?.password) errors.push(...treeErrors.password.errors);
    if (treeErrors?.email) errors.push(...treeErrors.email.errors);
    if (treeErrors?.confirmPassword) errors.push(...treeErrors.confirmPassword.errors);
    return {
      errors: errors,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: validatedFields.data.email,
    },
  });

  if (user) {
    return {
      errors: ["User already exists, try logging in"],
    };
  }
  // else {
  //   await prisma.user.create({
  //     data: {
  //       email: validatedFields.data.email,
  //       passwordHash:
  //     }
  //   })
  // }
}
