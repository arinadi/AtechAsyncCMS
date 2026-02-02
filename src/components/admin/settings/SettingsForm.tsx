'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { updateSettings } from '@/app/admin/settings/actions';

interface SettingsFormProps {
    initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true);
        try {
            const result = await updateSettings(formData);
            if (!result.success) {
                alert(result.error);
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form action={handleSubmit} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Site Title
                    </label>
                    <input
                        name="site_title"
                        defaultValue={initialSettings.site_title || ''}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="My Awesome Blog"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Site Description
                    </label>
                    <textarea
                        name="site_description"
                        defaultValue={initialSettings.site_description || ''}
                        rows={3}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="A brief description of your site"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-700/50">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
