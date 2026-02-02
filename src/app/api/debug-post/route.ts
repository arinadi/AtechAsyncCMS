import { db } from '@/db';
import { posts } from '@/db/schema/posts';
import { generateSlug } from '@/lib/utils/slug';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        // 1. Define test content with an image
        const testContent = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Before image' }]
                },
                {
                    type: 'image',
                    attrs: {
                        src: 'https://example.com/image.jpg',
                        alt: 'Test Image',
                        title: null
                    }
                },
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'After image' }]
                }
            ]
        };

        // 2. Create a test post
        const slug = 'debug-test-' + Date.now();
        // Since we don't have a logged-in user context in this simple GET, 
        // we'll need to fake the authorId or find an existing user.
        // For debugging, let's just find the first user.
        const user = await db.query.users.findFirst();

        if (!user) {
            return NextResponse.json({ error: 'No users found to create post' });
        }

        const [newPost] = await db.insert(posts).values({
            title: 'Debug Post',
            slug: slug,
            content: testContent as any,
            authorId: user.id,
            status: 'draft'
        }).returning();

        // 3. Retrieve the post immediately
        const fetchedPost = await db.query.posts.findFirst({
            where: eq(posts.id, newPost.id)
        });

        // 4. Compare
        return NextResponse.json({
            original: testContent,
            fetched: fetchedPost?.content,
            match: JSON.stringify(testContent) === JSON.stringify(fetchedPost?.content),
            postId: newPost.id
        });

    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, title } = body;

        const slug = 'debug-post-' + Date.now();
        const user = await db.query.users.findFirst();

        if (!user) {
            return NextResponse.json({ error: 'No user found' });
        }

        console.log('API Debug Save - Incoming Content:', JSON.stringify(content, null, 2));

        const [newPost] = await db.insert(posts).values({
            title: title || 'Debug Post API',
            slug,
            content: content,
            authorId: user.id,
            status: 'draft'
        }).returning();

        const fetchedPost = await db.query.posts.findFirst({
            where: eq(posts.id, newPost.id)
        });

        console.log('API Debug Save - Fetched Content:', JSON.stringify(fetchedPost?.content, null, 2));

        return NextResponse.json({
            savedId: newPost.id,
            incomingContent: content,
            fetchedContent: fetchedPost?.content,
            match: JSON.stringify(content) === JSON.stringify(fetchedPost?.content)
        });

    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
