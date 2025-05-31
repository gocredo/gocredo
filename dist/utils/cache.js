import redis from '../lib/redis';
const DEFAULT_EXPIRY = 60 * 5; // 5 minutes
export async function getCache(key) {
    const data = await redis.get(key);
    return data ?? null;
}
export async function setCache(key, value, ttl = DEFAULT_EXPIRY) {
    await redis.set(key, value, { ex: ttl });
}
export async function deletePatternedCache(pattern) {
    let cursor = 0;
    do {
        const [nextCursor, keys] = await redis.scan(cursor, { match: pattern, count: 100 });
        cursor = parseInt(nextCursor);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } while (cursor !== 0);
}
