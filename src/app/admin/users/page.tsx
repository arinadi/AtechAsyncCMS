import { db } from '@/db';
import { users } from '@/db/schema/users';
import { auth } from '@/lib/auth';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { InviteUserModal } from '@/components/admin/users/InviteUserModal';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const session = await auth();
    const allUsers = await db.query.users.findMany({
        orderBy: [desc(users.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Users & Team</h1>
                    <p className="text-slate-400">Manage access to the dashboard</p>
                </div>
                <InviteUserModal />
            </div>

            <UsersTable users={allUsers} currentUserId={session?.user?.id} />
        </div>
    );
}
