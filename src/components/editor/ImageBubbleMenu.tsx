import { type Editor } from '@tiptap/react';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
} from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';

interface ImageBubbleMenuProps {
    editor: Editor;
}

export function ImageBubbleMenu({ editor }: ImageBubbleMenuProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editor) return;

        const updateHandler = () => {
            const isImage = editor.isActive('image');
            setShowMenu(isImage);

            if (isImage) {
                const { from } = editor.state.selection;
                // Try to get the node at current selection
                const node = editor.view.nodeDOM(from) as HTMLElement;

                if (node) {
                    const nodeRect = node.getBoundingClientRect();
                    // Find the relative container (our wrapper)
                    const container = editor.view.dom.closest('.relative');

                    if (container) {
                        const containerRect = container.getBoundingClientRect();

                        // Calculate position relative to the container
                        // We want it centered above the image
                        const top = nodeRect.top - containerRect.top - 50; // 50px offset for menu height + padding
                        const left = (nodeRect.left - containerRect.left) + (nodeRect.width / 2);

                        setMenuPos({ top, left });
                    }
                }
            }
        };

        // Initial check
        updateHandler();

        // Listen to updates
        editor.on('selectionUpdate', updateHandler);
        editor.on('transaction', updateHandler);

        return () => {
            editor.off('selectionUpdate', updateHandler);
            editor.off('transaction', updateHandler);
        };
    }, [editor]);

    const setAlign = useCallback((align: 'left' | 'center' | 'right') => {
        editor.chain().focus().updateAttributes('image', { align }).run();
    }, [editor]);

    const setWidth = useCallback((width: string) => {
        editor.chain().focus().updateAttributes('image', { width }).run();
    }, [editor]);

    if (!editor || !showMenu) return null;

    return (
        <div
            ref={menuRef}
            className="absolute z-50 flex items-center gap-1 p-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{
                top: `${menuPos.top}px`,
                left: `${menuPos.left}px`,
                transform: 'translateX(-50%)' // Center the menu horizontally
            }}
        >
            {/* Alignment */}
            <div className="flex bg-slate-700/50 rounded-lg overflow-hidden p-0.5">
                <button
                    onClick={() => setAlign('left')}
                    className={`p-1.5 rounded transition-colors ${editor.getAttributes('image').align === 'left' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    title="Align Left"
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setAlign('center')}
                    className={`p-1.5 rounded transition-colors ${editor.getAttributes('image').align === 'center' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    title="Align Center"
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setAlign('right')}
                    className={`p-1.5 rounded transition-colors ${editor.getAttributes('image').align === 'right' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    title="Align Right"
                >
                    <AlignRight className="w-4 h-4" />
                </button>
            </div>

            <div className="w-px h-6 bg-slate-700 mx-1" />

            {/* Size */}
            <div className="flex bg-slate-700/50 rounded-lg overflow-hidden p-0.5">
                <button
                    onClick={() => setWidth('25%')}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${editor.getAttributes('image').width === '25%' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    title="Small (25%)"
                >
                    25%
                </button>
                <button
                    onClick={() => setWidth('50%')}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${editor.getAttributes('image').width === '50%' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    title="Medium (50%)"
                >
                    50%
                </button>
                <button
                    onClick={() => setWidth('75%')}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${editor.getAttributes('image').width === '75%' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    title="Large (75%)"
                >
                    75%
                </button>
                <button
                    onClick={() => setWidth('100%')}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${editor.getAttributes('image').width === '100%' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    title="Full (100%)"
                >
                    100%
                </button>
            </div>
        </div>
    );
}
