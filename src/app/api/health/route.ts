import { db } from '@/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check database connectivity
        await db.execute(sql`SELECT 1`);

        return Response.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
        });
    } catch (error) {
        return Response.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
