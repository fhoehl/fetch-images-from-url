FROM node:lts-alpine

COPY . /app

RUN apk update --no-cache

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

USER pptruser

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETER_DISABLE_DEV_SHM true
ENV CHROMIUM_PATH "/usr/bin/chromium-browser"

RUN npm install

CMD npm run start
