import path from 'path';
import test from 'ava';
import micro from 'micro';
import listen from 'test-listen';
import request from 'request-promise';
import sinon from 'sinon';

import Service from '../service';
import scrapper from '../service/scrapper';
import cache from '../service/cache';

test('no given url', async (t) => {
  const service = micro(Service);
  const url = await listen(service);
  const body = await request(url);
  t.deepEqual(JSON.parse(body), { usage: 'Give me an url parameter.' });
  service.close();
});

test('with an extraneous parameter', async (t) => {
  const service = micro(Service);
  const url = await listen(service);

  try {
    await request({ uri: url, qs: { hello: 'me' } });
  } catch (err) {
    t.is(err.statusCode, 500);
  }
  service.close();
});

test.serial('open an url', async (t) => {
  const stub = sinon.stub(scrapper, 'findImageUrlsFromUrl').resolves(['image.jpg']);
  const service = micro(Service);
  const url = await listen(service);
  const fileUrl = `file://${path.join(__dirname, 'test.html')}`;
  const body = await request({ uri: url, qs: { url: fileUrl } });

  t.is(JSON.parse(body).images.length, 1);

  service.close();
  stub.restore();
});

test.serial('on error', async (t) => {
  const stub = sinon.stub(scrapper, 'findImageUrlsFromUrl').returns(Promise.reject(new Error()));

  const service = micro(Service);
  const url = await listen(service);
  const fileUrl = `file://${path.join(__dirname, 'test.html')}`;

  try {
    await request({ uri: url, qs: { url: fileUrl } });
  } catch (err) {
    t.is(err.statusCode, 500);
    t.is(JSON.parse(err.response.body).images.length, 0);
  }

  service.close();
  stub.restore();
});

test.serial('no cache', async (t) => {
  const stub = sinon.stub(cache, 'getImagesFromCache').resolves([]);
  const urls = await scrapper.findImageUrlsFromUrl(
    `file://${path.join(__dirname, 'test.html')}`,
  );
  t.is(urls.length, 4);
  stub.restore();
});

test.serial('hit cache', async (t) => {
  const stub = sinon.stub(cache, 'getImagesFromCache').resolves(['image.jpg']);
  const urls = await scrapper.findImageUrlsFromUrl(
    `file://${path.join(__dirname, 'test.html')}`,
  );
  t.is(urls.length, 1);
  stub.restore();
});
