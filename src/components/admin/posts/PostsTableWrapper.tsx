import { PostsTable } from '@/components/admin/posts/PostsTable';
import { getPosts } from '@/app/admin/posts/actions';

interface PostsTableWrapperProps {
    status?: string;
    search?: string;
    page?: number;
}

export async function PostsTableWrapper({ status, search, page = 1 }: PostsTableWrapperProps) {
    const { posts, total } = await getPosts({
        status,
        search,
        page,
        limit: 10,
    });

    return (
        <PostsTable
            posts={posts}
            total={total}
            currentStatus={status}
            currentSearch={search}
            currentPage={page}
        />
    );
}
