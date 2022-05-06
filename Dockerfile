FROM node:18-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

EXPOSE 9119

CMD ["node", "-r", "esm", "src/server.js"]
