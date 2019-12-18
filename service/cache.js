const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);

const CACHE_INVALIDATION = 1000;

const getCacheKey = (url) => Buffer.from(url).toString('base64');

const getImagesFromCache = async (url) => {
  const cacheKey = getCacheKey(url);
  const imageUrls = await redis.lrange(cacheKey, 0, -1);
  return imageUrls;
};

const setImagesInCache = async (url, imageUrls) => {
  const cacheKey = getCacheKey(url);
  await redis.rpush(cacheKey, imageUrls);
  await redis.expire(cacheKey, CACHE_INVALIDATION);
};

module.exports = {
  getImagesFromCache,
  setImagesInCache,
};
