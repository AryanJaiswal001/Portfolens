FROM node:22-alpine

WORKDIR /app

COPY Backend/package*.json ./

RUN npm install

COPY Backend .

EXPOSE 5000

CMD ["npm", "run", "dev"]