FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install --verbose --omit=dev

COPY . .

CMD ["npm", "start"]