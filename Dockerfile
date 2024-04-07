FROM node:20.11.0-alpine
WORKDIR /usr/src/app

RUN apk add --no-cache ghostscript graphicsmagick

ENV NODE_ENV=production

COPY . .
RUN yarn install --production=false
RUN yarn build

EXPOSE 80
CMD [ "node", "build/main/index.js" ]