
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST || "smtp.resend.com",
                port: parseInt(process.env.EMAIL_SERVER_PORT || "465"),
                auth: {
                    user: "resend",
                    pass: process.env.RESEND_API_KEY,
                },
            },
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            sendVerificationRequest: async ({ identifier, url, provider }) => {
                try {
                    const { data, error } = await resend.emails.send({
                        from: provider.from || "onboarding@resend.dev",
                        to: identifier,
                        subject: `Autentificare în Kidmy`,
                        html: `
            <body style="background: #f9f9f9; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 20px; text-align: center; font-family: sans-serif;">
                <h1 style="color: #4f46e5; margin-bottom: 20px;">Kidmy 🚀</h1>
                <p style="font-size: 18px; color: #555; margin-bottom: 30px;">
                  Salut! Apasă butonul de mai jos pentru a intra în contul tău.
                </p>
                <a href="${url}" style="display: inline-block; background: #4f46e5; color: #fff; font-size: 18px; font-weight: bold; padding: 15px 30px; border-radius: 12px; text-decoration: none;">
                  Click Aici pentru Logare
                </a>
                <p style="color: #999; font-size: 14px; margin-top: 30px;">
                  Dacă nu ai cerut acest link, poți ignora acest email.
                </p>
              </div>
            </body>
            `,
                    });
                    if (error) throw new Error(error.message);
                } catch (error) {
                    console.error("Verification email failed", error);
                }
            },
        }),
        CredentialsProvider({
            name: "Parolă",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Parolă", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                // Simple auto-register if user doesn't exist? 
                // No, let's just do login for now to be safe, or allow creation if no user
                if (!user) {
                    // Create user if not exist (Auto-register)
                    const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
                    const newUser = await prisma.user.create({
                        data: {
                            email: credentials.email as string,
                            passwordHash: hashedPassword,
                            credits: 0, // No credits until verified
                        }
                    });

                    return newUser;
                }

                if (!user.passwordHash) return null; // User registered via social/email but no password set

                const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
                if (!isValid) return null;

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    events: {
        async signIn({ user, account }) {
            // Only award if user is verified (Google or Email Link used)
            const isVerified = user.emailVerified || account?.provider === "google" || account?.provider === "email";

            if (isVerified && user.id) {
                // Check if already got the bonus
                const existingBonus = await prisma.creditTransaction.findFirst({
                    where: {
                        userId: user.id,
                        type: "BONUS",
                        description: { contains: "bun venit" }
                    }
                });

                if (!existingBonus) {
                    await prisma.$transaction([
                        prisma.user.update({
                            where: { id: user.id },
                            data: { credits: { increment: 10 } }
                        }),
                        prisma.creditTransaction.create({
                            data: {
                                userId: user.id,
                                amount: 10,
                                type: "BONUS",
                                description: "Bonus de bun venit: 10 credite cadou! 🎁 (Email Verificat)",
                            },
                        })
                    ]);
                    console.log(`Verified bonus awarded to: ${user.email}`);
                }
            }
        }
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.credits = (user as any).credits;
            }
            if (trigger === "update" && session?.credits !== undefined) {
                token.credits = session.credits;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).credits = token.credits as number;
            }
            return session;
        },
    },
});

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            credits: number;
        } & DefaultSession["user"];
    }

    interface User {
        credits?: number;
        emailVerified?: Date | null;
    }
}

import { DefaultSession } from "next-auth";
