import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <main className="flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
        <div className="w-24 h-24 mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-4xl font-bold text-white">A</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-white mb-4">
          ATechAsync CMS
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl">
          Non-blocking. Share while free. A modern, serverless CMS built for performance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center px-6 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200"
          >
            Admin Dashboard
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center px-6 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
          >
            Login
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-slate-800/30 border border-slate-700/30 rounded-2xl">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Fast by Default</h3>
            <p className="text-slate-400 text-sm">Built on Next.js 15 & Neon Serverless for lightning-fast performance.</p>
          </div>

          <div className="p-6 bg-slate-800/30 border border-slate-700/30 rounded-2xl">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
            <p className="text-slate-400 text-sm">Whitelist-based authentication ensures only authorized users can access.</p>
          </div>

          <div className="p-6 bg-slate-800/30 border border-slate-700/30 rounded-2xl">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Free Tier Optimized</h3>
            <p className="text-slate-400 text-sm">Designed to run completely free on Vercel's hobby plan.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
