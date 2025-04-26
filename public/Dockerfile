FROM node:18-slim

WORKDIR /usr/src/app/public

COPY ../package*.json ../
RUN npm ci --production

COPY . .
EXPOSE 3000

CMD ["node", "app.js"]
