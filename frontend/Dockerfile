FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Si ya tienes Nginx en el servidor, 
# solo necesitas copiar la carpeta dist o 
# build generada por React a la ruta que sirve Nginx.

# En el docker-compose.yml de producción solo necesitas 
# los servicios de backend (Spring Boot) y base de datos (MySQL).
# El frontend ya lo sirve Nginx fuera de Docker.
