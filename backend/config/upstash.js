import { Redis } from "@upstash/redis";
import { RateLimit } from "@upstash/ratelimit";

const redis = new Redis({
    redis: Redis.fromEnv(),
    limiter: RateLimit.slidingWindow(100, "60 s"),
});

await redis.set("foo", "bar");
await redis.get("foo");
