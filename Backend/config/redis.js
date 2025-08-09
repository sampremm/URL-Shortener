// config/redis.js
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.error('Redis error:', err));
client.on('connect', () => console.log('Redis connected'));

const connectRedis = async () => {
  await client.connect();
};

export default client;
export { connectRedis };