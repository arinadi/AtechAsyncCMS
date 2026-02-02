'use server';

import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const InviteSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['admin', 'author']),
});

export async function inviteUser(email: string, role: 'admin' | 'author' = 'author') {
    try {
        const session = await auth();
        // Check if admin
        if (session?.user?.role !== 'admin') {
            return { success: false, error: 'Unauthorized: Admin access required' };
        }

        const valid = InviteSchema.safeParse({ email, role });
        if (!valid.success) {
            return { success: false, error: valid.error.errors[0].message };
        }

        // Check if user already exists
        const existing = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existing) {
            return { success: false, error: 'User with this email already exists' };
        }

        // Create invited user
        await db.insert(users).values({
            email,
            status: 'invited',
            role, // Use selected role
            invitedBy: session.user.id,
            invitedAt: new Date(),
        });

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Invite user error:', error);
        return { success: false, error: 'Failed to invite user' };
    }
}

export async function deleteUser(userId: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
        }

        // Prevent self-deletion
        if (session.user.id === userId) {
            return { success: false, error: 'Cannot delete your own account' };
        }

        await db.delete(users).where(eq(users.id, userId));
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Delete user error:', error);
        return { success: false, error: 'Failed to delete user' };
    }
}
