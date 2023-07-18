FROM node:20-bookworm-slim

WORKDIR /project/frontend

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "start"]