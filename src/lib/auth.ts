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
    session: {
        strategy: 'jwt',
    },
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

        // JWT Callback - Persistence
        // This is called whenever a token is created or updated.
        // We persist the user's role/status from the DB into the token.
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.email, token.email!),
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.status = dbUser.status;
                    token.displayName = dbUser.displayName;
                }
            }

            // Refetch on session update (optional, but good for profile updates)
            if (trigger === 'update' && session) {
                token = { ...token, ...session };
            }

            return token;
        },

        // Session Callback
        // This is called whenever the session is checked (e.g. auth()).
        // We read from the token (memory/cookie) instead of the DB.
        // @ts-ignore
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'admin' | 'author';
                session.user.status = token.status as 'setup' | 'invited' | 'pending' | 'active' | 'suspended';
                session.user.displayName = token.displayName as string;
            }
            return session;
        }
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
