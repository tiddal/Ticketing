FROM node:alpine

COPY .packagetoken root/.npmrc
WORKDIR /app
COPY .npmrc .
COPY package.json .
RUN npm install --only=prod
COPY . .
RUN rm .packagetoken

CMD ["npm", "start"]
