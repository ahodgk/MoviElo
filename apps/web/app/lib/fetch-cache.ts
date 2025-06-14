import NodeFetchCache, { FileSystemCache } from "node-fetch-cache";
export const fetch = NodeFetchCache.create({
  cache: new FileSystemCache({
    ttl: 1000 * 60 * 60 * 24, // 1 day
  }),
});
