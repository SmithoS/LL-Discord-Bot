FROM node:16-alpine

# 外部パラメータ
ARG SERVICE_DIR

ADD ./${SERVICE_DIR} /app

WORKDIR  /app

RUN npm ci

CMD ["npm", "run", "start"]