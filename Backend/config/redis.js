import Redis from 'ioredis';

const connectRedis = () => {
  const client = new Redis(process.env.REDIS_URL); // Initialize Redis client

  client.on('connect', () => {
    console.log('Redis connected successfully');
  });

  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  return client; // Return the Redis client instance
};

export default connectRedis;