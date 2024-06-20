FROM node:18-alpine AS base

WORKDIR /app

COPY package.json yarn.lock* 

COPY . .
# RUN yarn install --frozen-lockfile &&\
RUN yarn install --frozen-lockfile &&\
    yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/.next ./.next

# RUN yarn install  --frozen-lockfile
RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start"]