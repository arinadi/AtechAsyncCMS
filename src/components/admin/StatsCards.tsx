export function StatsCards() {
    const stats = [
        {
            label: 'Total Posts',
            value: '0',
            change: null,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            color: 'blue',
        },
        {
            label: 'Published',
            value: '0',
            change: null,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'green',
        },
        {
            label: 'Drafts',
            value: '0',
            change: null,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            color: 'yellow',
        },
        {
            label: 'Total Views',
            value: '0',
            change: null,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            color: 'purple',
        },
    ];

    const colorClasses = {
        blue: {
            bg: 'bg-blue-500/20',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
        },
        green: {
            bg: 'bg-green-500/20',
            text: 'text-green-400',
            border: 'border-green-500/30',
        },
        yellow: {
            bg: 'bg-yellow-500/20',
            text: 'text-yellow-400',
            border: 'border-yellow-500/30',
        },
        purple: {
            bg: 'bg-purple-500/20',
            text: 'text-purple-400',
            border: 'border-purple-500/30',
        },
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
                const colors = colorClasses[stat.color as keyof typeof colorClasses];

                return (
                    <div
                        key={stat.label}
                        className={`bg-slate-800/50 rounded-2xl border ${colors.border} p-6 transition-all duration-200 hover:bg-slate-800/70`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text}`}>
                                {stat.icon}
                            </div>
                            {stat.change && (
                                <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                    </div>
                );
            })}
        </div>
    );
}
