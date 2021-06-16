FROM node:16.3-alpine3.11

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

EXPOSE 9119

CMD ["node", "-r", "esm", "src/server.js"]
