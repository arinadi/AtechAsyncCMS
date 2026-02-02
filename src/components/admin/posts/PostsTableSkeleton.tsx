export function PostsTableSkeleton() {
    return (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700/50">
                            <th className="text-left py-4 px-6 text-slate-400 font-medium w-[40%]">Title</th>
                            <th className="text-left py-4 px-6 text-slate-400 font-medium">Author</th>
                            <th className="text-left py-4 px-6 text-slate-400 font-medium">Status</th>
                            <th className="text-left py-4 px-6 text-slate-400 font-medium">Date</th>
                            <th className="text-right py-4 px-6 text-slate-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="py-4 px-6">
                                    <div className="w-3/4 h-5 bg-slate-700 rounded mb-2" />
                                    <div className="w-1/2 h-4 bg-slate-700/50 rounded" />
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700" />
                                        <div className="w-20 h-4 bg-slate-700 rounded" />
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="w-16 h-6 bg-slate-700 rounded-full" />
                                </td>
                                <td className="py-4 px-6">
                                    <div className="w-24 h-4 bg-slate-700 rounded" />
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="w-8 h-8 bg-slate-700 rounded inline-block" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
