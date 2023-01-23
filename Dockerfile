# syntax=docker/dockerfile:1

# Stage 1 - the build process
FROM node:18-slim as build-deps
ARG FONTAWESOME_NPM_AUTH_TOKEN
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", ".npmrc", "./"]
RUN npm config set '//npm.fontawesome.com/:_authToken' "$FONTAWESOME_NPM_AUTH_TOKEN"
RUN npm ci
RUN npm run ci:check
COPY . .
RUN npm run build
RUN rm .npmrc

# Stage 2 - the static server
FROM nginx:1.23
COPY --from=build-deps /usr/src/app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "'daemon off;'"]
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
