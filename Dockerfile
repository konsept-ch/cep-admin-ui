# syntax=docker/dockerfile:1

# Stage 1 - the build process
FROM node:16.16-alpine as build-deps
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", ".npmrc", "./"]
RUN npm ci
COPY . .
ENV REACT_APP_SERVICE_URL=${REACT_APP_SERVICE_URL}
RUN cross-env REACT_APP_SERVICE_URL=$REACT_APP_SERVICE_URL npm run build

# Stage 2 - the static server
FROM nginx:1.23-alpine
COPY --from=build-deps /usr/src/app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "'daemon off;'"]
