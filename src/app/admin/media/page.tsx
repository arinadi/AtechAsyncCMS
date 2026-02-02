import { list } from '@vercel/blob';
import { MediaGrid } from '@/components/admin/media/MediaGrid';
import { MediaUpload } from '@/components/admin/media/MediaUpload';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
    const { blobs } = await list();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Media Library</h1>
                    <p className="text-slate-400">Manage your images and files</p>
                </div>
                <MediaUpload />
            </div>

            <MediaGrid initialBlobs={blobs} />
        </div>
    );
}
