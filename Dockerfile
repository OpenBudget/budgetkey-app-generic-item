FROM node:8-alpine

COPY . /app/
RUN apk add --update git
RUN cd /app/ && \
    npm install && npm install --only=dev && \
    npm run pree2e && npm run tsc

EXPOSE 8000

CMD cd /app/ && npm run dist-serve

