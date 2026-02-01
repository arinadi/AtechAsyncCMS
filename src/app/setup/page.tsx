import { db } from '@/db';
import { redirect } from 'next/navigation';
import { SetupForm } from './setup-form';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
    // Check if any users exist
    const existingUsers = await db.query.users.findFirst();

    if (existingUsers) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            ATechAsync Setup
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Configure your CMS for the first time
                        </p>
                    </div>

                    <SetupForm />
                </div>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Non-blocking. Share while free.
                </p>
            </div>
        </div>
    );
}
