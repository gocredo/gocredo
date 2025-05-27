import crypto from "crypto";
import { GraphQLResolveInfo } from "graphql";
import { deletePatternedCache, getCache, setCache } from './cache';


function hashFieldSelection(info: GraphQLResolveInfo): string {
  const fieldNodes = info.fieldNodes?.[0];
  const selectionSet = JSON.stringify(fieldNodes.selectionSet);
  return crypto.createHash("md5").update(selectionSet).digest("hex");
}

type ResolverFn = (...args: any[]) => Promise<any>;
// provide the key for doing caching 
export function withCache(
  keyBuilder: (...args: any[]) => string,
  resolver: ResolverFn,
  ttlSeconds = 300
): ResolverFn {
  return async (...args) => { 
    const info = args[3] as GraphQLResolveInfo;
    const queryHash = hashFieldSelection(info);
    const baseKey = keyBuilder(...args);
    const key = `${baseKey}:${queryHash}`;

    const cached = await getCache(key);
    if (cached) return cached;

    const result = await resolver(...args);
    await setCache(key, result, ttlSeconds);
    return result;
  };
}

// Jis cache entry ko invalidate (delete) karna hai kisi particular updation/deletion par just uski key array aayegi me
export function withCacheInvalidation(
  keyBuilder: (...args: any[]) => string[],
  resolver: ResolverFn
): ResolverFn {
  return async (...args) => {
    const result = await resolver(...args);
    const keys = keyBuilder(...args);
    await Promise.all(keys.map(deletePatternedCache));
    return result;
  };
}
