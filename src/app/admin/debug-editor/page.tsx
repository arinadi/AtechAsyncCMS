'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { useState } from 'react';

const TEST_CONTENT = {
    type: 'doc',
    content: [
        {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Top text' }]
        },
        {
            type: 'image',
            attrs: {
                src: 'https://public.blob.vercel-storage.com/e2e-simple-blog-header-image-123.jpg', // Dummy URL
                alt: 'Test Image',
                title: null
            }
        },
        {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Bottom text' }]
        }
    ]
};

export default function DebugEditorPage() {
    const [content, setContent] = useState<any>(TEST_CONTENT);

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold text-white">Debug Editor</h1>
            <div className="bg-slate-900 p-4 rounded-xl">
                <TiptapEditor
                    content={content}
                    onChange={setContent}
                />
            </div>
            <pre className="bg-black p-4 rounded text-xs text-green-400 overflow-auto">
                {JSON.stringify(content, null, 2)}
            </pre>
        </div>
    );
}
