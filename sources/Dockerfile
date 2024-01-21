FROM node:alpine AS builder
ENV NODE_ENV production
WORKDIR /app
COPY ./sources/ .
RUN yarn install
RUN yarn add -D tailwindcss postcss autoprefixer
RUN yarn add serve
RUN yarn build
CMD ["serve", "-s", "dist", "-p", "3000"]