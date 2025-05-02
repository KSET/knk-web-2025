# Build stage using Node and npm
FROM node:20-alpine AS build

WORKDIR /app
COPY . .

# Install all dependencies (including in workspaces)
RUN npm install

# Build the Nuxt app (you can add studio if needed)
RUN npm run --workspace=nuxt-app build

# Production stage: serve with Caddy
FROM caddy:2-alpine

RUN cat > /etc/caddy/Caddyfile <<EOF
:80 {
  root * /app
  try_files {path} /index.html
  file_server
}
EOF

# Copy static output from the build stage
COPY --from=build /app/nuxt-app/.output/public /app
