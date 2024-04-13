FROM node:20.11.0-alpine
WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN yarn install --production=false
COPY ./ ./
ENV NUXT_APP_BASE_URL=/dashboard/
ENV PORT=80
RUN yarn build
EXPOSE 80
CMD ["node", ".output/server/index.mjs"]