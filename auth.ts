
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
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
                    const { host } = new URL(url);
                    // Standard Resend logic
                    await resend.emails.send({
                        from: provider.from || "onboarding@resend.dev",
                        to: identifier,
                        subject: `Autentificare în Kidmy`,
                        text: `Link magic pentru logare: ${url}`,
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
                } catch (error) {
                    console.error("Failed to send verification email", error);
                    throw new Error("Failed to send verification email");
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
        verifyRequest: "/auth/verify-request", // (Optional) Custom verify page
    },
    callbacks: {
        session: async ({ session, user }) => {
            if (session?.user) {
                session.user.id = user.id;
                // session.user.role = user.role; // if we had roles
            }
            return session;
        }
    }
});
