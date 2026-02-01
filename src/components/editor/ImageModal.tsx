'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Link, X, Loader2 } from 'lucide-react';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (url: string, alt?: string) => void;
}

type TabType = 'upload' | 'external';

export function ImageModal({ isOpen, onClose, onInsert }: ImageModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('upload');
    const [externalUrl, setExternalUrl] = useState('');
    const [altText, setAltText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = useCallback(() => {
        setExternalUrl('');
        setAltText('');
        setError('');
        setPreviewUrl('');
        setIsUploading(false);
    }, []);

    const handleClose = useCallback(() => {
        resetState();
        onClose();
    }, [onClose, resetState]);

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
            setPreviewUrl(url);
            setAltText(file.name.replace(/\.[^/.]+$/, ''));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleExternalUrlChange = useCallback((url: string) => {
        setExternalUrl(url);
        setError('');
        if (url && isValidUrl(url)) {
            setPreviewUrl(url);
        } else {
            setPreviewUrl('');
        }
    }, []);

    const handleInsert = useCallback(() => {
        const url = activeTab === 'upload' ? previewUrl : externalUrl;
        if (!url) {
            setError('Please provide an image');
            return;
        }
        if (activeTab === 'external' && !isValidUrl(url)) {
            setError('Please enter a valid URL');
            return;
        }
        onInsert(url, altText);
        handleClose();
    }, [activeTab, previewUrl, externalUrl, altText, onInsert, handleClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white">Insert Image</h3>
                    <button
                        onClick={handleClose}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700/50">
                    <button
                        onClick={() => { setActiveTab('upload'); resetState(); }}
                        className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'upload'
                                ? 'text-blue-400 border-b-2 border-blue-400'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                    <button
                        onClick={() => { setActiveTab('external'); resetState(); }}
                        className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'external'
                                ? 'text-blue-400 border-b-2 border-blue-400'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Link className="w-4 h-4" />
                        External URL
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {activeTab === 'upload' ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isUploading
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                                }`}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                    <span className="text-slate-300">Uploading...</span>
                                </div>
                            ) : previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-48 mx-auto rounded-lg"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-8 h-8 text-slate-500" />
                                    <span className="text-slate-300">Drop image here or click to select</span>
                                    <span className="text-sm text-slate-500">Max 4.5MB</span>
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
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={externalUrl}
                                    onChange={(e) => handleExternalUrlChange(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-48 mx-auto rounded-lg"
                                    onError={() => setPreviewUrl('')}
                                />
                            )}
                        </div>
                    )}

                    {/* Alt Text */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Alt Text (optional)
                        </label>
                        <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Describe the image"
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-slate-700/50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        disabled={isUploading || (!previewUrl && !externalUrl)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
                    >
                        Insert
                    </button>
                </div>
            </div>
        </div>
    );
}

function isValidUrl(string: string): boolean {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}
