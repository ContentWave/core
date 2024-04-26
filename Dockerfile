FROM node:22.0.0-alpine
ARG NUXT_LICENSE
WORKDIR /app
RUN apk add --no-cache ghostscript graphicsmagick python3 make g++
ENV NODE_ENV=production
ENV PORT=80
ENV HOST=0.0.0.0
COPY ./package.json ./yarn.lock ./
RUN yarn install --production=false
COPY . /app
RUN yarn build && rm -Rf ./src
ENV NUXT_UI_PRO_LICENSE=$NUXT_LICENSE
WORKDIR /app/frontend/auth
RUN yarn install && yarn generate
WORKDIR /app/frontend/dashboard
RUN yarn install && yarn generate
WORKDIR /app
RUN mkdir -p ./build/frontend/auth/.output && cp -Rf ./frontend/auth/.output/public ./build/frontend/auth/.output/public && mkdir -p ./build/frontend/dashboard/.output && cp -Rf ./frontend/dashboard/.output/public ./build/frontend/dashboard/.output/public && rm -Rf ./frontend
EXPOSE 80
CMD ["node", "./build/index.js --no-node-snapshot"]