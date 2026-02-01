import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CompleteProfileForm } from './complete-profile-form';

export const dynamic = 'force-dynamic';

export default async function CompleteProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    if (session.user.status === 'active') {
        redirect('/admin/dashboard');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-blue-500">
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || 'Profile'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {session.user.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome, {session.user.name || session.user.email}!
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Complete your profile to get started
                        </p>
                    </div>

                    <CompleteProfileForm
                        userId={session.user.id}
                        defaultName={session.user.name || ''}
                    />
                </div>
            </div>
        </div>
    );
}
