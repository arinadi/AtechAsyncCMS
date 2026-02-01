'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(formData: FormData) {
    const userId = formData.get('userId') as string;
    const name = formData.get('name') as string;
    const displayName = formData.get('displayName') as string;
    const bio = formData.get('bio') as string;
    const image = formData.get('image') as string;

    await db.update(users)
        .set({
            name,
            displayName,
            bio: bio || null,
            image: image || null,
            updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

    revalidatePath('/admin/profile');
    return { success: true };
}
