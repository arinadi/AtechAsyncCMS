'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import { deleteUser } from '@/app/admin/users/actions';
import { type User } from '@/db/schema/users';

interface UsersTableProps {
    users: User[];
    currentUserId?: string;
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this user? They will lose access immediately.')) return;

        setDeleting(userId);
        const result = await deleteUser(userId);

        if (!result.success) {
            alert(result.error);
        }
        setDeleting(null);
    };

    const StatusChip = ({ status }: { status: string }) => {
        const styles = {
            active: 'bg-green-500/20 text-green-400 border-green-500/40',
            invited: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
            suspended: 'bg-red-500/20 text-red-400 border-red-500/40',
        }[status] || 'bg-slate-700 text-slate-400 border-slate-600';

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} capitalize`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-800/80 border-b border-slate-700/50">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden relative border border-slate-600 flex items-center justify-center shrink-0">
                                        {user.image ? (
                                            <Image src={user.image} alt={user.name || ''} fill className="object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-slate-500">
                                                {(user.name || user.email || '?')[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{user.name || 'Pending...'}</div>
                                        <div className="text-sm text-slate-400">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-300 capitalize">
                                    {user.role === 'admin' ? <Shield className="w-4 h-4 text-blue-400" /> : <UserIcon className="w-4 h-4" />}
                                    {user.role}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <StatusChip status={user.status} />
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {user.id !== currentUserId && (
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        disabled={deleting === user.id}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                                        title="Remove User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
