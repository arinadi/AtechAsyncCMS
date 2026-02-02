import { db } from '@/db';
import { options } from '@/db/schema/options';
import { SettingsForm } from '@/components/admin/settings/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const allOptions = await db.select().from(options);

    // Convert array of objects to a single object map
    const settingsMap = allOptions.reduce((acc, curr) => {
        acc[curr.key] = curr.value as string;
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-white">Site Settings</h1>
                <p className="text-slate-400">Configure your website's global information</p>
            </div>

            <SettingsForm initialSettings={settingsMap} />
        </div>
    );
}
