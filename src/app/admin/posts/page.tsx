import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { PostsTableWrapper } from '@/components/admin/posts/PostsTableWrapper';
import { PostsTableSkeleton } from '@/components/admin/posts/PostsTableSkeleton';

interface PostsPageProps {
    searchParams: Promise<{
        status?: string;
        search?: string;
        page?: string;
    }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page) : 1;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Posts</h1>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            <Suspense key={`${params.status}-${params.search}-${page}`} fallback={<PostsTableSkeleton />}>
                <PostsTableWrapper
                    status={params.status}
                    search={params.search}
                    page={page}
                />
            </Suspense>
        </div>
    );
}
