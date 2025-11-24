import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (credentials?.password !== "password") return null;
        return {
          id: "1",
          name: "Fill Murray",
          email: "bill@fillmurray.com",
        };
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
