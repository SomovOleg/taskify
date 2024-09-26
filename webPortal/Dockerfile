FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli && npm install -force
COPY . .
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]
