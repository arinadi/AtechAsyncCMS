import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { users, accounts, sessions, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users as any,
        accountsTable: accounts as any,
        sessionsTable: sessions as any,
        verificationTokensTable: verificationTokens as any,
    }),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        // Whitelist validation - only registered emails can login
        async signIn({ user }) {
            if (!user.email) return false;

            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, user.email),
            });

            // Deny if not in whitelist or suspended
            if (!existingUser || existingUser.status === 'suspended') {
                return false;
            }

            // Update status and lastLoginAt on login
            if (existingUser.status === 'invited' || existingUser.status === 'setup') {
                await db.update(users)
                    .set({ status: 'pending', lastLoginAt: new Date() })
                    .where(eq(users.id, existingUser.id));
            } else {
                await db.update(users)
                    .set({ lastLoginAt: new Date() })
                    .where(eq(users.id, existingUser.id));
            }

            return true;
        },

        // Inject role and status into session
        async session({ session, user }) {
            if (session.user && user) {
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.id, user.id),
                });

                if (dbUser) {
                    session.user.id = dbUser.id;
                    session.user.role = dbUser.role;
                    session.user.status = dbUser.status;
                    session.user.displayName = dbUser.displayName;
                }
            }
            return session;
        },
    },
});

// Extend session types
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            image?: string | null;
            role: 'admin' | 'author';
            status: 'setup' | 'invited' | 'pending' | 'active' | 'suspended';
            displayName?: string | null;
        };
    }
}
