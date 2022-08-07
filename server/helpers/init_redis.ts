import { createClient } from 'redis';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';

const client = createClient({
  url: 'redis://127.0.0.1:6379',
});
client.connect();

client.on('connect', () => {
  console.log('Client connected to redis...');
});

client.on('ready', () => {
  console.log('Client connected to redis and ready to use...');
});

client.on('error', (err) => {
  console.log(err.message);
});

client.on('end', () => {
  console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
  client.quit();
});

export const redisDelete = async (
  userId: RedisCommandArgument | Array<RedisCommandArgument>,
  callback: (value: number | null) => void
) => {
  const deletion: number | null = await client.DEL(userId);
  callback(deletion);
};

export const redisSet = async (
  userId: RedisCommandArgument,
  token: string,
  callback: (value: string | null) => void
) => {
  const duration: number = 365 * 24 * 60 * 60;
  const setted: string | null = await client.SET(userId, token, {
    EX: duration,
  });
  callback(setted);
};

export const redisGet = async (
  key: RedisCommandArgument,
  callback: (value: string | null) => void
) => {
  const value: string | null = await client.GET(key);
  callback(value);
};

export default client;
