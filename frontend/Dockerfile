FROM node:18.16-alpine3.18

WORKDIR /project/frontend

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "start"]