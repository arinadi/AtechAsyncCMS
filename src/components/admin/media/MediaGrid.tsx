'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Trash2, Check, ExternalLink } from 'lucide-react';
import { deleteBlob } from '@/app/admin/media/actions';

interface BlobItem {
    url: string;
    pathname: string;
    size: number;
    uploadedAt: Date;
}

interface MediaGridProps {
    initialBlobs: BlobItem[];
}

export function MediaGrid({ initialBlobs }: MediaGridProps) {
    const [blobs, setBlobs] = useState<BlobItem[]>(initialBlobs);
    const [copying, setCopying] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleCopy = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopying(url);
            setTimeout(() => setCopying(null), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleDelete = async (url: string) => {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;

        setDeleting(url);
        const result = await deleteBlob(url);

        if (result.success) {
            setBlobs(prev => prev.filter(b => b.url !== url));
        } else {
            alert('Failed to delete file');
        }
        setDeleting(null);
    };

    if (blobs.length === 0) {
        return (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-slate-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No media files</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                    Upload images to see them here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {blobs.map((blob) => (
                <div key={blob.url} className="group relative aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-500 transition-colors">
                    <Image
                        src={blob.url}
                        alt={blob.pathname}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                        <p className="text-xs text-slate-300 truncate w-full text-center mb-2">
                            {blob.pathname.split('/').pop()}
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCopy(blob.url)}
                                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                                title="Copy URL"
                            >
                                {copying === blob.url ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>

                            <a
                                href={blob.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                                title="Open in new tab"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>

                            <button
                                onClick={() => handleDelete(blob.url)}
                                disabled={deleting === blob.url}
                                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
