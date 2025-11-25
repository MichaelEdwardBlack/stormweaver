// import "server-only";
// import { SignJWT, jwtVerify } from "jose";
// import { SessionPayload } from "@/lib/definitions";

// import cookies from "next/headers";
// import { prisma } from "@/lib/prisma";
// import { encrypt } from "@/lib/session";
// export async function encrypt(payload: SessionPayload) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d")
//     .sign(encodedKey);
// }

// export async function decrypt(session: string | undefined = "") {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ["HS256"],
//     });
//     return payload;
//   } catch (error) {
//     console.log("Failed to verify session");
//   }
// }

// export async function createSession(userId: string) {
//   const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

//   const session = await prisma.session.create({
//     data: {
//       userId,
//       expires,
//       sessionToken: "",
//       accessToken: "",
//     }
//   });
//   const sessionId = session.id;

//   // 2. Encrypt the session ID
//   const session = await encrypt({ sessionId, expiresAt });

//   // 3. Store the session in cookies for optimistic auth checks
//   const cookieStore = await cookies();
//   cookieStore.set("session", session, {
//     httpOnly: true,
//     secure: true,
//     expires: expiresAt,
//     sameSite: "lax",
//     path: "/",
//   });
// }
