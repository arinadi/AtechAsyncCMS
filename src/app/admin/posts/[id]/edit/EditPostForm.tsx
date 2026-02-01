'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { FeaturedImagePicker } from '@/components/editor/FeaturedImagePicker';
import { updatePost, deletePost, type PostFormData } from '../../actions';
import type { Post, TiptapJSON } from '@/db/schema/posts';
import { ArrowLeft, Save, Send, Trash2, Loader2, Check, AlertCircle } from 'lucide-react';

interface EditPostFormProps {
    post: Post;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function EditPostForm({ post }: EditPostFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState<TiptapJSON | undefined>(post.content || undefined);
    const [excerpt, setExcerpt] = useState(post.excerpt || '');
    const [featuredImage, setFeaturedImage] = useState<string | undefined>(post.featuredImage || undefined);
    const [status, setStatus] = useState(post.status);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-save functionality
    useEffect(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
            if (title.trim() && (title !== post.title || content !== post.content)) {
                handleAutoSave();
            }
        }, 30000); // Auto-save every 30 seconds

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [title, content, excerpt, featuredImage]);

    const handleAutoSave = useCallback(async () => {
        setSaveStatus('saving');
        const data: Partial<PostFormData> = {
            title: title.trim(),
            content,
            excerpt: excerpt.trim() || undefined,
            featuredImage,
        };

        const result = await updatePost(post.id, data);
        if (result.success) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
            setSaveStatus('error');
        }
    }, [post.id, title, content, excerpt, featuredImage]);

    const handleSave = useCallback(async (publish: boolean) => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setSaveStatus('saving');
        setError('');

        const data: Partial<PostFormData> = {
            title: title.trim(),
            content,
            excerpt: excerpt.trim() || undefined,
            featuredImage,
            status: publish ? 'published' : status,
        };

        const result = await updatePost(post.id, data);

        if (result.success) {
            setStatus(publish ? 'published' : status);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
            setError(result.error || 'Failed to save post');
            setSaveStatus('error');
        }
    }, [post.id, title, content, excerpt, featuredImage, status]);

    const handleDelete = useCallback(async () => {
        const result = await deletePost(post.id);
        if (result.success) {
            router.push('/admin/posts');
        } else {
            setError(result.error || 'Failed to delete post');
        }
    }, [post.id, router]);

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
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Post</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status === 'published'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {status}
                            </span>
                            {saveStatus === 'saving' && (
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Saving...
                                </span>
                            )}
                            {saveStatus === 'saved' && (
                                <span className="flex items-center gap-1 text-xs text-green-400">
                                    <Check className="w-3 h-3" />
                                    Saved
                                </span>
                            )}
                            {saveStatus === 'error' && (
                                <span className="flex items-center gap-1 text-xs text-red-400">
                                    <AlertCircle className="w-3 h-3" />
                                    Error saving
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-medium rounded-xl transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save
                    </button>
                    {status !== 'published' && (
                        <button
                            onClick={() => handleSave(true)}
                            disabled={saveStatus === 'saving'}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-medium rounded-xl transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Publish
                        </button>
                    )}
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
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xl font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <TiptapEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Write your post content..."
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                        <FeaturedImagePicker
                            value={featuredImage}
                            onChange={setFeaturedImage}
                        />
                    </div>

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

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Delete Post?</h3>
                        <p className="text-slate-400 mb-6">
                            This action cannot be undone. The post will be permanently deleted.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
