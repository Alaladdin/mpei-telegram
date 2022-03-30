import '@sentry/tracing';
import * as Sentry from '@sentry/node';
import { Telegraf } from 'telegraf';
import { contextMiddleware } from './src/middleware';
import config from './config';
import commands from './src/commands';
// import cron from './src/cron';
import { initStore } from './src/store';

const bot = new Telegraf(config.token);

Sentry.init({ dsn: config.sentryDsn, tracesSampleRate: 1.0, environment: config.currentEnv });

bot.use(async (ctx, next) => {
  await contextMiddleware(ctx);

  const transaction = Sentry.startTransaction({ op: ctx.sentryOpearation, name: ctx.sentryName });

  Sentry.setUser({ username: ctx.username, isAdmin: ctx.isAdmin });

  next()
    .catch(Sentry.captureException)
    .finally(() => transaction.finish());
});

bot.launch()
  .then(initStore)
  .then(() => {
    commands.init(bot);
    // cron.init(bot);
    console.info('[BOT] has been started');
  })
  .catch((err) => {
    console.error('[ERROR] Launch error:', err);
    process.exit(0);
  });

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
