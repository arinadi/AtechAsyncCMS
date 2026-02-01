'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function completeProfileAction(formData: FormData) {
    const userId = formData.get('userId') as string;
    const name = formData.get('name') as string;
    const displayName = formData.get('displayName') as string;
    const bio = formData.get('bio') as string;

    await db.update(users)
        .set({
            name,
            displayName,
            bio: bio || null,
            status: 'active',
            updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

    redirect('/admin/dashboard');
}
