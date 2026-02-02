'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { FeaturedImagePicker } from '@/components/editor/FeaturedImagePicker';
import { createPost, type PostFormData } from '../actions';
import type { TiptapJSON } from '@/db/schema/posts';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<TiptapJSON | undefined>();
    const [excerpt, setExcerpt] = useState('');
    const [featuredImage, setFeaturedImage] = useState<string | undefined>();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = useCallback(async (publish: boolean) => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setIsSaving(true);
        setError('');

        const data: PostFormData = {
            title: title.trim(),
            content: content ? JSON.parse(JSON.stringify(content)) : undefined,
            excerpt: excerpt.trim() || undefined,
            featuredImage,
            status: publish ? 'published' : 'draft',
        };

        const result = await createPost(data);

        if (result.success && result.post) {
            router.push(`/admin/posts/${result.post.id}/edit`);
        } else {
            setError(result.error || 'Failed to save post');
            setIsSaving(false);
        }
    }, [title, content, excerpt, featuredImage, router]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/posts"
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">New Post</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-medium rounded-xl transition-colors"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-medium rounded-xl transition-colors"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Publish
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Title */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xl font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Editor */}
                    <TiptapEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Write your post content..."
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Featured Image */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                        <FeaturedImagePicker
                            value={featuredImage}
                            onChange={setFeaturedImage}
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Excerpt
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Write a short summary..."
                            rows={4}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
