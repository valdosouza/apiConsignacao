FROM node:alpine3.11
WORKDIR /usr/code
COPY package*.json ./
RUN npm install
ADD app /usr/code/
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
