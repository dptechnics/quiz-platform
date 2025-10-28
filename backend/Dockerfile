FROM node:22.14.0 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

FROM node:22.14.0-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
EXPOSE 3333
USER node
CMD ["node", "src/main.js"]
