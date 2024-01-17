FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5001

ENV MONGO_USERNAME=admin
ENV MONGO_PASSWORD=password

CMD ["npm", "start"]


