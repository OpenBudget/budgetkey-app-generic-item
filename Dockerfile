FROM node:8-alpine

RUN apk add --update git

COPY . /app/
RUN cd /app/ && \
    npm install --no-audit && \
    find node_modules/moment/locale -type f | grep -v he | xargs rm && \
    npm run build --prod

EXPOSE 8000

CMD cd /app/ && npm start
