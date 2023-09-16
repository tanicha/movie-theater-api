FROM node:19.6.1

COPY . /app

WORKDIR /app

RUN npm install

CMD ["npm", "start"]

# express runs on 3000
EXPOSE 90