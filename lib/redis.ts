// lib/redis.ts
import { createClient } from 'redis';

const redis = createClient({
    url: process.env.REDIS_URL, // contoh: redis://localhost:6379
});

redis.on('error', (err) => console.error('Redis Client Error', err));

if (!redis.isOpen) {
    await redis.connect();
}

export default redis;
