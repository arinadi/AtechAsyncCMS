'use server';

import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function deleteBlob(url: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        await del(url);
        revalidatePath('/admin/media');
        return { success: true };
    } catch (error) {
        console.error('Delete blob error:', error);
        return { success: false, error: 'Failed to delete file' };
    }
}
