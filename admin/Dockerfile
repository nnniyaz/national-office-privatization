# Build React App
FROM node:19.2.0 as build
COPY . .
WORKDIR /admin
COPY package.json /app
RUN npm install

RUN npm run i18n
RUN npm run build:prod

# Serve React App with Nginx
FROM nginx:1.16.0-alpine
COPY .k8s/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]