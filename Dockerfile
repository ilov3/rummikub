FROM node:22-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install --omit=dev --omit=optional

COPY . /app

EXPOSE 9119

CMD ["node", "src/server.js"]
