'use server';

import { db } from '@/db';
import { users, options, DEFAULT_OPTIONS } from '@/db/schema';
import { redirect } from 'next/navigation';

export async function setupAction(formData: FormData) {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const displayName = formData.get('displayName') as string;
    const siteTitle = formData.get('siteTitle') as string;
    const siteDescription = formData.get('siteDescription') as string;

    // Create first admin user
    await db.insert(users).values({
        email,
        name,
        displayName,
        role: 'admin',
        status: 'setup',
    });

    // Insert default options with custom site title/description
    const optionsToInsert = DEFAULT_OPTIONS.map(opt => {
        if (opt.key === 'site_title' && siteTitle) {
            return { ...opt, value: siteTitle };
        }
        if (opt.key === 'site_description' && siteDescription) {
            return { ...opt, value: siteDescription };
        }
        return opt;
    });

    await db.insert(options).values(optionsToInsert);

    redirect('/login');
}
