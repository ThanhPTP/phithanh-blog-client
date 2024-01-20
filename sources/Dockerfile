FROM node:alpine AS builder
ENV NODE_ENV production
WORKDIR /app
COPY . .
RUN yarn install --peer
RUN yarn add tailwindcss@latest postcss@latest autoprefixer@latest
RUN yarn build
FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf