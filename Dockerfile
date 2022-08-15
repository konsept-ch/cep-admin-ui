# syntax=docker/dockerfile:1

# Stage 1 - the build process
FROM node:16.16-alpine as build-deps
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", ".npmrc", "./"]
RUN npm ci
COPY . .
ENV REACT_APP_SERVICE_URL=$REACT_APP_SERVICE_URL
ENV SERVICES_URL=$REACT_APP_SERVICE_URL
RUN npm run build

# Stage 2 - the static server
FROM nginx:1.23-alpine
COPY --from=build-deps /usr/src/app/build /var/www
# COPY nginx.conf /etc/nginx/nginx.conf
ENV REACT_APP_SERVICE_URL=$REACT_APP_SERVICE_URL
ENV SERVICES_URL=$REACT_APP_SERVICE_URL
COPY ./nginx.conf.template /nginx.conf.template
EXPOSE 80
# CMD ["nginx", "-g", "'daemon off;'"]
CMD ["/bin/sh" , "-c" , "envsubst < /nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
