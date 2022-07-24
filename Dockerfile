FROM node:14-slim

RUN apk add --update git

COPY . /app/
RUN cd /app/ && \
    npm install node-sass && \
    npm install --no-audit && \
    find node_modules/moment/locale -type f | grep -v he | xargs rm && \
    npm run build --prod

EXPOSE 8000

CMD cd /app/ && npm start
