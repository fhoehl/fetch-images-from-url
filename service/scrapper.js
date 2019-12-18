const puppeteer = require('puppeteer');

const cache = require('./cache');

const imageExtensionRe = new RegExp('.*[.](jpg|png|jpeg|gif)');

const findImageUrlsFromUrl = async (url) => {
  const cached = await cache.getImagesFromCache(url);

  if (cached && cached.length > 0) {
    return cached;
  }

  const puppeteerArgs = [];

  if (process.env.PUPPETER_DISABLE_DEV_SHM) {
    puppeteerArgs.push('--disable-dev-shm-usage');
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH,
    args: puppeteerArgs,
  });

  const page = await browser.newPage();
  const imageUrls = [];

  page.on('response', async (response) => {
    const responseUrl = response.url();
    if (imageExtensionRe.exec(responseUrl)) {
      imageUrls.push(responseUrl);
    }
  });

  await page.goto(url);
  await page.waitFor(10);
  await browser.close();

  cache.setImagesInCache(url, imageUrls);

  return imageUrls;
};

module.exports = {
  findImageUrlsFromUrl,
};
