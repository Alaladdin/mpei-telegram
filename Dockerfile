FROM node:16-alpine

RUN apk add chromium nss freetype harfbuzz ca-certificates ttf-freefont --no-cache
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm install -g pnpm

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY . .

CMD [ "npm", "start" ]
