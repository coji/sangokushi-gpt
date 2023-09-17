# base node image
FROM node:18-bullseye-slim as base

# Install openssl for Prisma
RUN apt-get update \
  && apt-get install --no-install-recommends -y procps vim-tiny \
  && apt-get clean \
  && npm i -g bun \
  && rm -rf /var/lib/apt/lists/* 

ENV PORT "8080"
ENV NODE_ENV "production"
WORKDIR /app

# Setup production node_modules
FROM base as production-deps

COPY package.json bun.lockb ./
RUN bun install --production --frozen-lockfile


# Build the app
FROM base as build

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build


FROM base

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json

CMD [ "bun", "start" ]
