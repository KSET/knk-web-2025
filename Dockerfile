# Build stage using Node and npm
FROM node:20-alpine AS build

WORKDIR /app
COPY . .

# Install all dependencies (including in workspaces)
RUN npm ci --legacy-peer-deps

ARG NUXT_SANITY_PROJECT_ID
ARG NUXT_SANITY_DATASET
ENV NUXT_SANITY_PROJECT_ID=$NUXT_SANITY_PROJECT_ID
ENV NUXT_SANITY_DATASET=$NUXT_SANITY_DATASET

RUN test -n "$NUXT_SANITY_PROJECT_ID" || (echo "NUXT_SANITY_PROJECT_ID is required" && exit 1)
RUN test -n "$NUXT_SANITY_DATASET" || (echo "NUXT_SANITY_DATASET is required" && exit 1)

# Build the Nuxt app (you can add studio if needed)
RUN npm run --workspace=nuxt-app generate

# Production stage: serve with Caddy
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile

# Copy static output from the build stage
COPY --from=build /app/nuxt-app/.output/public /app
