'use server';

import { db } from '@/db';
import { posts, type NewPost, type Post, type TiptapJSON } from '@/db/schema/posts';
import { auth } from '@/lib/auth';
import { generateSlug } from '@/lib/utils/slug';
import { eq, desc, sql, and, ilike } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface PostFormData {
    title: string;
    content?: TiptapJSON;
    excerpt?: string;
    featuredImage?: string;
    status?: 'draft' | 'published' | 'scheduled' | 'trash';
    publishedAt?: Date;
}

export interface PostFilters {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
        const existing = await db.query.posts.findFirst({
            where: excludeId
                ? and(eq(posts.slug, uniqueSlug), sql`${posts.id} != ${excludeId}`)
                : eq(posts.slug, uniqueSlug),
        });

        if (!existing) break;
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

export async function createPost(data: PostFormData): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const slug = await ensureUniqueSlug(generateSlug(data.title));

        const [newPost] = await db.insert(posts).values({
            title: data.title,
            slug,
            content: data.content,
            excerpt: data.excerpt,
            featuredImage: data.featuredImage,
            status: data.status || 'draft',
            authorId: session.user.id,
            publishedAt: data.status === 'published' ? new Date() : data.publishedAt,
        }).returning();

        revalidatePath('/admin/posts');
        return { success: true, post: newPost };
    } catch (error) {
        console.error('Create post error:', error);
        return { success: false, error: 'Failed to create post' };
    }
}

export async function updatePost(id: string, data: Partial<PostFormData>): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // DEBUG: Log content being updated
        if (data.content) {
            console.log('UpdatePost Content:', JSON.stringify(data.content, null, 2));
        }

        const updateData: Partial<NewPost> = {
            ...data,
            updatedAt: new Date(),
        };

        // Update slug if title changed
        if (data.title) {
            updateData.slug = await ensureUniqueSlug(generateSlug(data.title), id);
        }

        // Set publishedAt if publishing
        if (data.status === 'published') {
            const existing = await db.query.posts.findFirst({
                where: eq(posts.id, id),
            });
            if (existing && !existing.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        const [updatedPost] = await db.update(posts)
            .set(updateData)
            .where(eq(posts.id, id))
            .returning();

        revalidatePath('/admin/posts');
        revalidatePath(`/admin/posts/${id}/edit`);
        return { success: true, post: updatedPost };
    } catch (error) {
        console.error('Update post error:', error);
        return { success: false, error: 'Failed to update post' };
    }
}

export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        await db.delete(posts).where(eq(posts.id, id));

        revalidatePath('/admin/posts');
        return { success: true };
    } catch (error) {
        console.error('Delete post error:', error);
        return { success: false, error: 'Failed to delete post' };
    }
}

export async function getPost(id: string): Promise<Post | null> {
    try {
        const post = await db.query.posts.findFirst({
            where: eq(posts.id, id),
        });

        if (post) {
            console.log('GetPost Content:', JSON.stringify(post.content, null, 2));
        }

        return post || null;
    } catch (error) {
        console.error('Get post error:', error);
        return null;
    }
}

export async function getPosts(filters?: PostFilters): Promise<{ posts: Post[]; total: number }> {
    try {
        const limit = filters?.limit || 10;
        const offset = ((filters?.page || 1) - 1) * limit;

        let whereClause = undefined;
        const conditions = [];

        if (filters?.status && filters.status !== 'all') {
            conditions.push(sql`${posts.status} = ${filters.status}`);
        }

        if (filters?.search) {
            conditions.push(ilike(posts.title, `%${filters.search}%`));
        }

        if (conditions.length > 0) {
            whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
        }

        const [postsResult, countResult] = await Promise.all([
            db.query.posts.findMany({
                where: whereClause,
                orderBy: desc(posts.createdAt),
                limit,
                offset,
            }),
            db.select({ count: sql<number>`count(*)` })
                .from(posts)
                .where(whereClause),
        ]);

        return {
            posts: postsResult,
            total: Number(countResult[0]?.count || 0),
        };
    } catch (error) {
        console.error('Get posts error:', error);
        return { posts: [], total: 0 };
    }
}
