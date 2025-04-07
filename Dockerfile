FROM node:21-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . ./
RUN npm run build && rm -rf ./src

FROM builder AS backend

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --nofund && npm i -g pm2
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js ./
EXPOSE 3000

ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]
