import Image from '@tiptap/extension-image';

export const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: (attributes) => {
                    return {
                        style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
                    };
                },
            },
            align: {
                default: 'center',
                renderHTML: (attributes) => {
                    let style = 'display: block;';
                    if (attributes.align === 'center') {
                        style += 'margin-left: auto; margin-right: auto;';
                    } else if (attributes.align === 'right') {
                        style += 'margin-left: auto; margin-right: 0;';
                    } else {
                        style += 'margin-right: auto; margin-left: 0;';
                    }
                    return {
                        style,
                        'data-align': attributes.align,
                    };
                },
            },
        };
    },
});
