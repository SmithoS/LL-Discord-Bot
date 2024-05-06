FROM node:18-alpine

# 外部パラメータ
ARG SERVICE_DIR

ADD ./${SERVICE_DIR} /app

WORKDIR  /app

RUN apk --update add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/* && \
    npm ci && \
    npm run build

CMD ["npm", "run", "start"]