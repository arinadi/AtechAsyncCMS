'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './EditorToolbar';
import type { TiptapJSON } from '@/db/schema/posts';

interface TiptapEditorProps {
    content?: TiptapJSON;
    onChange?: (content: TiptapJSON) => void;
    placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = 'Start writing your post...' }: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-400 hover:text-blue-300 underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Underline,
        ],
        content: content || {
            type: 'doc',
            content: [{ type: 'paragraph' }],
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getJSON() as TiptapJSON);
            }
        },
    });

    if (!editor) {
        return (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 min-h-[500px] flex items-center justify-center">
                <div className="text-slate-400">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
