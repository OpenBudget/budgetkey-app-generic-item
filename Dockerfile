FROM node:14-slim

COPY . /app/
RUN cd /app/ && \
    apt-get update && apt-get install -y python3 && \
    npm install --no-audit && \
    find node_modules/moment/locale -type f | grep -v he | xargs rm && \
    npm run build --prod

EXPOSE 8000

CMD cd /app/ && npm start
