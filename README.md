# fetch-images-from-url

fetch-images-from-url is a service that given an URL of a Webpage will return
a list of images from that page.

📃 ↦ 🗾🌁🌉

fetch-images-from-url uses Puppeteer and is packaged with Docker. Results are
cached in Redis for a limited time.

## Usage

```bash
docker-compose build
docker-compose up
```

```bash
curl "localhost:3000?url=https://fhoehl.com"
```

## Notes

### Running Chrome in Docker

I had troubles running Chrome in Docker. I'm using a Docker custom seccomp file
in the `docker-compose.yml` provided by
[https://ndportmann.com/chrome-in-docker/](https://ndportmann.com/chrome-in-docker/)

More tips from the [Puppeteer troubleshooting
page](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker).

## License

[MIT license](LICENSE)
