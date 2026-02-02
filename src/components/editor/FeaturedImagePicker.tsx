'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Link } from 'lucide-react';

interface FeaturedImagePickerProps {
    value?: string;
    onChange: (url: string | undefined) => void;
}

type TabType = 'upload' | 'external';

export function FeaturedImagePicker({ value, onChange }: FeaturedImagePickerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('upload');
    const [externalUrl, setExternalUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 4.5 * 1024 * 1024) {
            setError('File size must be less than 4.5MB');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Upload failed');
            }

            const { url } = await response.json();
            onChange(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleExternalUrlSubmit = () => {
        if (!externalUrl) {
            setError('Please enter a URL');
            return;
        }
        try {
            new URL(externalUrl);
            onChange(externalUrl);
            setExternalUrl('');
            setError('');
        } catch {
            setError('Please enter a valid URL');
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">
                    Featured Image
                </label>
                {!value && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('upload'); setError(''); }}
                            className={`text-xs px-2 py-1 rounded transition-colors ${activeTab === 'upload' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('external'); setError(''); }}
                            className={`text-xs px-2 py-1 rounded transition-colors ${activeTab === 'external' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            URL
                        </button>
                    </div>
                )}
            </div>

            {value ? (
                <div className="relative group">
                    <img
                        src={value}
                        alt="Featured"
                        className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                        type="button"
                        onClick={() => onChange(undefined)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <>
                    {activeTab === 'upload' ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isUploading
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                                }`}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                    <span className="text-sm text-slate-300">Uploading...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-6 h-6 text-slate-500" />
                                    <span className="text-sm text-slate-300">Click or drop to upload</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={externalUrl}
                                onChange={(e) => setExternalUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleExternalUrlSubmit}
                                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                                <Link className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
