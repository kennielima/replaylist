FROM node:22-slim AS builder

WORKDIR /app
# COPY .env.local .env.local

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app
# COPY .env.local .env.local
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.ts .
COPY --from=builder /app/package.json .
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

EXPOSE 3000
CMD ["npm", "start"]