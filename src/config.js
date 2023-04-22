import dotenv from 'dotenv';

dotenv.config();

const { env } = process;
const currentEnv = env.NODE_ENV || 'development';
const isProd = currentEnv === 'production';

export default {
  isProd,
  currentEnv,
  token           : isProd ? env.TOKEN : env.TOKEN_DEV,
  apiUrl          : env.API_URL,
  sentryDsn       : env.SENTRY_DSN,
  mainChatId      : +(isProd ? env.MAIN_CHAT_ID : env.ADMIN_CHAT_ID),
  serverDateFormat: 'YYYY.MM.DD',
  webAppUrl       : env.WEB_APP_URL || 'https://winx.mpei.space',
};
