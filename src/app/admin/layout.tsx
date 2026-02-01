import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    if (session.user.status === 'pending') {
        redirect('/complete-profile');
    }

    return (
        <div className="min-h-screen bg-slate-900 flex">
            <AdminSidebar userRole={session.user.role} />

            <div className="flex-1 flex flex-col min-h-screen ml-64">
                <AdminHeader user={session.user} />

                <main className="flex-1 p-6 bg-slate-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
