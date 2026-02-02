export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 animate-pulse"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-xl" />
                        <div className="w-16 h-6 bg-slate-700 rounded-full" />
                    </div>
                    <div className="w-24 h-8 bg-slate-700 rounded mb-2" />
                    <div className="w-32 h-4 bg-slate-700 rounded" />
                </div>
            ))}
        </div>
    );
}
