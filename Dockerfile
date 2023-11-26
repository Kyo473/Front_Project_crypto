FROM node:latest

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build
CMD ["npm", "start"]