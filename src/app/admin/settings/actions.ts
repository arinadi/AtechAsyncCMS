'use server';

import { db } from '@/db';
import { options } from '@/db/schema/options';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function updateSettings(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
        }

        const updates = [
            { key: 'site_title', value: formData.get('site_title') },
            { key: 'site_description', value: formData.get('site_description') },
        ];

        for (const { key, value } of updates) {
            if (typeof value === 'string') {
                await db.insert(options)
                    .values({ key, value })
                    .onConflictDoUpdate({
                        target: options.key,
                        set: { value },
                    });
            }
        }

        revalidatePath('/admin/settings');
        revalidatePath('/', 'layout'); // Update public layout too
        return { success: true };
    } catch (error) {
        console.error('Update settings error:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
