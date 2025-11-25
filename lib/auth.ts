import NextAuth, { type DefaultSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { loginSchema } from "./schemas";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";
import { redirect } from "next/navigation";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
  }
}

const prismaAdapter = PrismaAdapter(prisma);
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  adapter: prismaAdapter,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const validatedFields = loginSchema.parse(credentials);
        const user = await prisma.user.findFirstOrThrow({
          where: { email: validatedFields.email },
        });
        console.log("authorize user", user);
        const isMatch = await compare(validatedFields.password, user.passwordHash as string);
        console.log("isMatch", isMatch);
        if (isMatch) {
          return user;
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("async jwt", token, account);
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    session({ session, token, user }) {
      // `session.user.address` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
  jwt: {
    encode: async function (params) {
      console.log("jwt encode", params);
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await prismaAdapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
