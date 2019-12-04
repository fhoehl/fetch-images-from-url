FROM node:lts-alpine
COPY . /app
WORKDIR /app
RUN npm i
CMD npm run test
CMD npm run start
