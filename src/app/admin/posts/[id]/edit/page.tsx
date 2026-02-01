import { notFound } from 'next/navigation';
import { getPost } from '../../actions';
import { EditPostForm } from './EditPostForm';

interface EditPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return <EditPostForm post={post} />;
}
