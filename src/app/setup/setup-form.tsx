'use client';

import { useActionState } from 'react';
import { setupAction } from './actions';

export function SetupForm() {
    const [, formAction, isPending] = useActionState(
        async (_: unknown, formData: FormData) => {
            await setupAction(formData);
            return null;
        },
        null
    );

    return (
        <form action={formAction} className="space-y-5">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Admin Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                    Use the same email as your Google account
                </p>
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
                    placeholder="John Doe"
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
                    placeholder="johndoe"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <hr className="border-slate-700" />

            <div>
                <label htmlFor="siteTitle" className="block text-sm font-medium text-slate-300 mb-2">
                    Site Title
                </label>
                <input
                    type="text"
                    id="siteTitle"
                    name="siteTitle"
                    required
                    placeholder="My Awesome Blog"
                    defaultValue="ATechAsync Blog"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-slate-300 mb-2">
                    Site Description
                </label>
                <input
                    type="text"
                    id="siteDescription"
                    name="siteDescription"
                    placeholder="Non-blocking. Share while free."
                    defaultValue="Non-blocking. Share while free."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Setting up...' : 'Complete Setup & Login'}
            </button>
        </form>
    );
}
