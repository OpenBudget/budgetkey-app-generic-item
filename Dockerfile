FROM node:8-alpine

RUN apk add --update git

COPY . /app/
RUN cd /app/ && \
    npm install --no-audit && \
    npm run build --prod

EXPOSE 8000

CMD cd /app/ && npm start
