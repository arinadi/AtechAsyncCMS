import { auth } from '@/lib/auth';
import { StatsCards } from '@/components/admin/StatsCards';
import { Suspense } from 'react';
import { StatsSkeleton } from '@/components/admin/StatsSkeleton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await auth();

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-slate-700/50 p-6">
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, {session?.user.displayName || session?.user.name || 'Admin'}!
                </h1>
                <p className="text-slate-400 mt-1">
                    Here&apos;s what&apos;s happening with your blog today.
                </p>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<StatsSkeleton />}>
                <StatsCards />
            </Suspense>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <a
                            href="/admin/posts/new"
                            className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors group"
                        >
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Create New Post</p>
                                <p className="text-slate-400 text-sm">Write and publish content</p>
                            </div>
                        </a>

                        <a
                            href="/admin/posts"
                            className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors group"
                        >
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Manage Posts</p>
                                <p className="text-slate-400 text-sm">View and edit all posts</p>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                    <div className="text-center py-8 text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>No recent activity</p>
                        <p className="text-sm">Activities will appear here</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
