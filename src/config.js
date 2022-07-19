import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default {
  isProd,
  currentEnv      : process.env.NODE_ENV || 'development',
  token           : isProd ? process.env.TOKEN : process.env.TOKEN_DEV,
  authToken       : process.env.AUTH_TOKEN,
  apiUrl          : process.env.API_URL,
  sentryDsn       : process.env.SENTRY_DSN,
  mainChatId      : +(isProd ? process.env.MAIN_CHAT_ID : process.env.ADMIN_CHAT_ID),
  adminChatId     : +process.env.ADMIN_CHAT_ID,
  serverDateFormat: 'YYYY.MM.DD',
  webAppUrl       : 'https://winx.mpei.space/',
  mailUsername    : process.env.MAIL_USERNAME,
  mailPassword    : process.env.MAIL_PASSWORD,
};
