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
  mainChatId      : isProd ? '-1001544093021' : '398532631',
  adminChatId     : '398532631',
  serverDateFormat: 'YYYY.MM.DD',
  mailUsername    : process.env.MAIL_USERNAME,
  mailPassword    : process.env.MAIL_PASSWORD,
};
