FROM node:20-alpine3.17 AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.
RUN corepack enable && corepack prepare yarn@4

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

COPY . .
RUN npx turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
# COPY --from=builder /app/out/full/.gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY justfile justfile

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
ARG ARG_VERSION
RUN VITE_GIT_REF=${ARG_VERSION} npx turbo build --filter=web...

FROM node:20-alpine3.17 AS runner
RUN corepack enable && corepack prepare yarn@4
RUN apk add just
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer --chown=expressjs:expressjs /app .
# ENV port 3000
EXPOSE 3000
ARG ARG_GIT_SHA
ARG ARG_BUILD_DATE
ARG ARG_VERSION
ENV VERSION=${ARG_VERSION}
ENV GIT_SHA=${ARG_GIT_SHA}
ENV BUILD_DATE=${ARG_BUILD_DATE}
ENTRYPOINT ["just","docker-web-start"]