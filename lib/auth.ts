import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true, // required on Vercel — allows NextAuth to trust x-forwarded-host
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const dbUser = await db.user.findUnique({ where: { email: user.email! } });
        token.role = dbUser?.role ?? "CUSTOMER";

        // Queue welcome email asynchronously outside JWT callback
        // Only send if: email not sent yet AND user was created in last 5 minutes
        if (dbUser && !dbUser.emailSent) {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          const isNewUser = dbUser.createdAt > fiveMinutesAgo;

          if (isNewUser) {
            // Non-blocking: queue email job for async processing
            // This moves email sending out of the auth critical path
            const userId = dbUser.id;
            const userEmail = dbUser.email!;
            const userName = dbUser.name || "";
            const userCreatedAt = dbUser.createdAt;

            // Fire and forget - don't await in JWT callback
            db.user.update({
              where: { id: userId },
              data: { emailSent: true },
            }).then(async () => {
              try {
                const { sendEmail } = await import("@/lib/email");
                const { WelcomeEmail } = await import("@/lib/email-templates/welcome");
                await sendEmail({
                  to: userEmail,
                  subject: "Welcome to Wellnza Nutrition!",
                  react: WelcomeEmail({ name: userName, email: userEmail }),
                });
              } catch (err) {
                console.error("[welcome email]", err);
              }
            }).catch(err => {
              console.error("[welcome email queue]", err);
            });
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});