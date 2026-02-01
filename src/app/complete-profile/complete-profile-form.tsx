'use client';

import { useActionState } from 'react';
import { completeProfileAction } from './actions';

interface CompleteProfileFormProps {
    userId: string;
    defaultName: string;
}

export function CompleteProfileForm({ userId, defaultName }: CompleteProfileFormProps) {
    const [, formAction, isPending] = useActionState(
        async (_: unknown, formData: FormData) => {
            await completeProfileAction(formData);
            return null;
        },
        null
    );

    return (
        <form action={formAction} className="space-y-5">
            <input type="hidden" name="userId" value={userId} />

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    defaultValue={defaultName}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
                    Display Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    required
                    minLength={2}
                    placeholder="johndoe"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                    This will be shown on your posts
                </p>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
                    Bio <span className="text-slate-500">(optional)</span>
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Saving...' : 'Complete Profile'}
            </button>
        </form>
    );
}
