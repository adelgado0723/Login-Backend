FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "./wait-for-it.UNIX.sh", "mysqldb:3306", "--", "node /usr/src/app/server.js" ]