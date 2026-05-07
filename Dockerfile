# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build Angular application
RUN npm run build -- --configuration production --output-hashing=all

# Stage 2: Runtime - Nginx
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder
COPY --from=builder /build/dist/ng-tailadmin /usr/share/nginx/html

# Metadata
LABEL maintainer="pedinephro@esprit.tn"
LABEL description="PediNephro Angular Frontend Dashboard"
LABEL service="frontend"
LABEL port="80"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]