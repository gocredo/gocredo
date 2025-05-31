import crypto from "crypto";
import { deletePatternedCache, getCache, setCache } from './cache';
function hashFieldSelection(info) {
    const fieldNodes = info.fieldNodes?.[0];
    const selectionSet = JSON.stringify(fieldNodes.selectionSet);
    return crypto.createHash("md5").update(selectionSet).digest("hex");
}
// provide the key for doing caching 
export function withCache(keyBuilder, resolver, ttlSeconds = 300) {
    return async (...args) => {
        const info = args[3];
        const queryHash = hashFieldSelection(info);
        const baseKey = keyBuilder(...args);
        const key = `${baseKey}:${queryHash}`;
        const cached = await getCache(key);
        if (cached)
            return cached;
        const result = await resolver(...args);
        await setCache(key, result, ttlSeconds);
        return result;
    };
}
// Jis cache entry ko invalidate (delete) karna hai kisi particular updation/deletion par just uski key array aayegi me
export function withCacheInvalidation(keyBuilder, resolver) {
    return async (...args) => {
        const result = await resolver(...args);
        const keys = keyBuilder(...args);
        await Promise.all(keys.map(deletePatternedCache));
        return result;
    };
}
