'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Post } from '@/db/schema/posts';
import { deletePost } from '@/app/admin/posts/actions';
import {
    Edit,
    Trash2,
    MoreVertical,
    Search,
    ChevronLeft,
    ChevronRight,
    FileText
} from 'lucide-react';

interface PostsTableProps {
    posts: Post[];
    total: number;
    currentStatus?: string;
    currentSearch?: string;
    currentPage: number;
}

const statusLabels: Record<string, { label: string; class: string }> = {
    draft: { label: 'Draft', class: 'bg-yellow-500/20 text-yellow-400' },
    published: { label: 'Published', class: 'bg-green-500/20 text-green-400' },
    scheduled: { label: 'Scheduled', class: 'bg-blue-500/20 text-blue-400' },
    trash: { label: 'Trash', class: 'bg-red-500/20 text-red-400' },
};

export function PostsTable({ posts, total, currentStatus, currentSearch, currentPage }: PostsTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(currentSearch || '');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const totalPages = Math.ceil(total / 10);

    const updateParams = (updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`/admin/posts?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ search: search || undefined, page: undefined });
    };

    const handleStatusFilter = (status: string) => {
        updateParams({ status: status === 'all' ? undefined : status, page: undefined });
    };

    const handleDelete = async (id: string) => {
        await deletePost(id);
        setDeleteConfirm(null);
        router.refresh();
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(date));
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Tabs */}
                <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
                    {['all', 'draft', 'published', 'scheduled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${(currentStatus || 'all') === status
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search posts..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </form>
            </div>

            {/* Table */}
            {posts.length === 0 ? (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No posts found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">
                        {currentSearch || currentStatus
                            ? 'Try adjusting your filters'
                            : 'Get started by creating your first post'}
                    </p>
                </div>
            ) : (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-visible">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Title</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400 hidden sm:table-cell">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400 hidden md:table-cell">Date</th>
                                <th className="w-12 px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20">
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="text-white hover:text-blue-400 font-medium transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                        <span className="sm:hidden block mt-1">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusLabels[post.status]?.class}`}>
                                                {statusLabels[post.status]?.label}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusLabels[post.status]?.class}`}>
                                            {statusLabels[post.status]?.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-400 hidden md:table-cell">
                                        {formatDate(post.publishedAt || post.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenDropdown(openDropdown === post.id ? null : post.id)}
                                                className="p-1 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            {openDropdown === post.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setOpenDropdown(null)}
                                                    />
                                                    <div className="absolute right-0 mt-1 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                                                        <Link
                                                            href={`/admin/posts/${post.id}/edit`}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                setOpenDropdown(null);
                                                                setDeleteConfirm(post.id);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                        Showing {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, total)} of {total}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => updateParams({ page: String(currentPage - 1) })}
                            disabled={currentPage <= 1}
                            className="p-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => updateParams({ page: String(currentPage + 1) })}
                            disabled={currentPage >= totalPages}
                            className="p-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Delete Post?</h3>
                        <p className="text-slate-400 mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
