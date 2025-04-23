# syntax=docker/dockerfile:1

# Stage 1 - the build process
FROM node:18-bullseye-slim as build-deps
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY . .
RUN npm run ci:check
RUN npm run build

# Stage 2 - the static server
FROM nginx:1.24
COPY --from=build-deps /usr/src/app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "'daemon off;'"]
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
