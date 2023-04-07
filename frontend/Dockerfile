FROM node:19.8.1-bullseye

WORKDIR /code/frontend/

COPY package*.json /code/frontend/
RUN npm install

COPY . /code/frontend/

CMD ["npm", "start"]