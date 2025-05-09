import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_URL); // Use 'new' to create an instance

client.on('connect', () => {
    console.log('Redis connected successfully');
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

export default client;
