'use client';

import { useActionState } from 'react';
import { updateProfileAction } from './actions';

interface ProfileFormProps {
    user: {
        id: string;
        name: string | null;
        displayName: string | null;
        email: string;
        image: string | null;
        bio: string | null;
        role: string;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(
        async (_: any, formData: FormData) => {
            await updateProfileAction(formData);
            return { success: true };
        },
        null
    );

    return (
        <form action={formAction} className="space-y-6 max-w-2xl">
            <input type="hidden" name="userId" value={user.id} />

            {state?.success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                    Profile updated successfully!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Role
                    </label>
                    <input
                        type="text"
                        disabled
                        value={user.role}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 capitalize cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        defaultValue={user.name || ''}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
                        Display Name
                    </label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        required
                        defaultValue={user.displayName || ''}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-300 mb-2">
                    Profile Image URL
                </label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    defaultValue={user.image || ''}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                    Direct link to your avatar image (e.g. from GitHub or Gravatar)
                </p>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
                    Bio
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={user.bio || ''}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
