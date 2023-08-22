FROM node:20-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends tini
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --ignore-scripts
RUN npm prune --production
COPY . .
ENV NODE_ENV=production
USER node
EXPOSE 3000
ENTRYPOINT [ "/usr/bin/tini", "--" ]
CMD ["node", "index"]
