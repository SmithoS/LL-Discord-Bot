FROM node:18-alpine

ADD ./shioriko /app
WORKDIR  /app

# ヘルスチェックで必要
EXPOSE 8000

RUN apk --update add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/* && \
    npm ci && \
    npm run build

CMD ["npm", "run", "start"]