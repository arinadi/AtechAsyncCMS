import Link from 'next/link';
import { getPosts } from './actions';
import { PostsTable } from '@/components/admin/posts/PostsTable';
import { Plus } from 'lucide-react';

interface PostsPageProps {
    searchParams: Promise<{
        status?: string;
        search?: string;
        page?: string;
    }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
    const params = await searchParams;
    const { posts, total } = await getPosts({
        status: params.status,
        search: params.search,
        page: params.page ? parseInt(params.page) : 1,
        limit: 10,
    });

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

            <PostsTable
                posts={posts}
                total={total}
                currentStatus={params.status}
                currentSearch={params.search}
                currentPage={params.page ? parseInt(params.page) : 1}
            />
        </div>
    );
}
