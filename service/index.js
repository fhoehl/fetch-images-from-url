const url = require('url');
const { send } = require('micro');
const scrapper = require('./scrapper');

const logError = (message) => {
  if (process.env.NODE_ENV === 'production') {
    console.error(message);
  }
};

module.exports = async (req, res) => {
  const parsedURL = url.parse(req.url, true);

  if (parsedURL.query.url) {
    try {
      const imageUrls = await scrapper.findImageUrlsFromUrl(parsedURL.query.url);
      send(res, 200, { images: imageUrls });
    } catch (err) {
      logError(err);
      send(res, 500, { images: [] });
    }
  } else if (Object.keys(parsedURL.query).length > 0) {
    send(res, 500, { usage: 'Give me an url parameter.' });
  } else {
    send(res, 200, { usage: 'Give me an url parameter.' });
  }
};
