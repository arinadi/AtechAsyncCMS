'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useMemo } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './EditorToolbar';
import { ImageBubbleMenu } from './ImageBubbleMenu';
import { CustomImage } from './extensions/CustomImage';
import type { TiptapJSON } from '@/db/schema/posts';

interface TiptapEditorProps {
    content?: TiptapJSON;
    onChange?: (content: TiptapJSON) => void;
    placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = 'Start writing your post...' }: TiptapEditorProps) {
    const extensions = useMemo(() => [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            },
        }),
        CustomImage.configure({
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
    ], [placeholder]);

    const editorProps = useMemo(() => ({
        attributes: {
            class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
        },
    }), []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        content: content || {
            type: 'doc',
            content: [{ type: 'paragraph' }],
        },
        editorProps,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getJSON() as TiptapJSON);
            }
        },
    });

    // Update editor content if content prop changes externally (e.g. from server)
    useEffect(() => {
        if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
            const { from, to } = editor.state.selection;
            editor.commands.setContent(content);
            editor.commands.setTextSelection({ from, to });
        }
    }, [editor, content]);

    if (!editor) {
        return (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 min-h-[500px] flex items-center justify-center">
                <div className="text-slate-400">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-visible relative">
            <EditorToolbar editor={editor} />
            <ImageBubbleMenu editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
