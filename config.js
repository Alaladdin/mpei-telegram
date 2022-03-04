import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default {
  token    : isProd ? process.env.TOKEN : process.env.TOKEN_DEV,
  authToken: process.env.AUTH_TOKEN,
  apiUrl   : process.env.API_URL,
};
