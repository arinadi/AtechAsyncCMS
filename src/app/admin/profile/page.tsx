import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ProfileForm } from './profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    // Fetch fresh user data
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 md:p-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || 'Profile'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white text-2xl font-bold">
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-slate-400">{user.displayName ? `@${user.displayName}` : 'No display name'}</p>
                    </div>
                </div>

                <ProfileForm user={{
                    id: user.id,
                    name: user.name,
                    displayName: user.displayName,
                    email: user.email,
                    image: user.image,
                    bio: user.bio,
                    role: user.role,
                }} />
            </div>
        </div>
    );
}
