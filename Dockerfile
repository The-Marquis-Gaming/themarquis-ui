FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY packages/nextjs/package.json ./packages/nextjs/package.json 
COPY packages/snfoundry/package.json ./packages/snfoundry/package.json 
## COPY packages/foundry/package.json ./packages/foundry/package.json 
COPY .env /app/packages/nextjs/.env
RUN yarn install --immutable
FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
WORKDIR /app/packages/nextjs
COPY packages/nextjs .
RUN yarn workspace @the-marquis-ui/nextjs build

FROM base AS runner
WORKDIR /app/packages/nextjs
ARG PORT=3000
ENV NODE_ENV production
ENV PORT=$PORT
ENV GENERATE_SOURCEMAP=false
COPY --from=builder /app/packages/nextjs/public ./public
COPY --from=builder /app/packages/nextjs/.next/standalone/packages/nextjs ./
COPY --from=builder /app/packages/nextjs/.next/static ./.next/static
EXPOSE $PORT
CMD ["node", "server.js"]
