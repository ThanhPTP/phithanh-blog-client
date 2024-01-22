FROM node:alpine AS builder
ENV NODE_ENV production
WORKDIR /app
COPY ./sources/ .
RUN yarn install
RUN yarn add -D tailwindcss postcss autoprefixer
RUN yarn build
RUN apk add npm
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-p", "3000"]
