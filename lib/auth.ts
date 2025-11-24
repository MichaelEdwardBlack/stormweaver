import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const validatedFields = loginSchema.parse(credentials);
        const user = await prisma.user.findFirstOrThrow({
          where: { email: validatedFields.email },
        });
        const isMatch = await compare(validatedFields.password, user.passwordHash as string);
        if (isMatch) {
          return user;
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session?.user?.name;
      return token;
    },
  },
});
