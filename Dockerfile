FROM node:16-alpine

RUN apk add chromium nss freetype harfbuzz ca-certificates ttf-freefont --no-cache
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm install -g pnpm

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --foreground-scripts=true --audit=false --omit=dev

COPY . .

CMD [ "npm", "start" ]
