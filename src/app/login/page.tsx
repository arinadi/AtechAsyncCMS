import { signIn } from '@/lib/auth';
import { db } from '@/db';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const params = await searchParams;

    // Check if setup is needed
    const existingUsers = await db.query.users.findFirst();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            ATechAsync
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Sign in to your dashboard
                        </p>
                    </div>

                    {params.error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                            {params.error === 'AccessDenied'
                                ? 'Your email is not registered. Contact an admin to get access.'
                                : 'An error occurred during sign in. Please try again.'
                            }
                        </div>
                    )}

                    {!existingUsers && (
                        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl text-yellow-400 text-sm text-center">
                            No admin configured yet.{' '}
                            <a href="/setup" className="underline hover:text-yellow-300">
                                Run setup first
                            </a>
                        </div>
                    )}

                    <form
                        action={async () => {
                            'use server';
                            await signIn('google', { redirectTo: '/admin/dashboard' });
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl transition-all duration-200 shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign in with Google
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-xs mt-6">
                        Only whitelisted emails can access the dashboard
                    </p>
                </div>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Non-blocking. Share while free.
                </p>
            </div>
        </div>
    );
}
