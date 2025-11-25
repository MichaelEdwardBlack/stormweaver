"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt-ts";
import { redirect } from "next/navigation";
import { LoginFormState, loginSchema, RegisterFormState, registerSchema } from "../schemas";

const SALT_LENGTH = 10;

export async function loginUser(state: LoginFormState, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }
}

export async function registerUser(state: RegisterFormState, formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: validatedFields.data.email,
    },
  });

  if (user) {
    return {
      message: "An error occurred while creating your account.",
    };
  } else {
    const hashedPassword = await hash(validatedFields.data.email, SALT_LENGTH);
    await prisma.user.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        passwordHash: hashedPassword,
      },
    });
    redirect("/dashboard");
  }
}
