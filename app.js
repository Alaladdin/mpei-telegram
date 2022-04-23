import '@sentry/tracing';
import * as Sentry from '@sentry/node';
import { Scenes, session, Telegraf } from 'telegraf';
import { contextMiddleware } from './src/middleware';
import config from './src/config';
import commands from './src/commands';
import cron from './src/cron';
import actualityScene from './src/scenes/actuality';

const bot = new Telegraf(config.token);
const actualityStage = new Scenes.Stage([actualityScene]);

if (config.isProd)
  Sentry.init({ dsn: config.sentryDsn, tracesSampleRate: 1.0, environment: config.currentEnv });

bot.use(session());
bot.use(actualityStage.middleware());
bot.use(async (ctx, next) => {
  await contextMiddleware(ctx);

  if (config.isProd) {
    const transaction = Sentry.startTransaction({ op: ctx.sentryOperation, name: ctx.sentryName });

    Sentry.setUser({
      username     : ctx.username,
      chatId       : ctx.chatId,
      userId       : ctx.userId,
      isAdmin      : ctx.isAdmin,
      isPrivateChat: ctx.isPrivateChat,
    });

    next()
      .catch(Sentry.captureException)
      .finally(() => transaction.finish());
  } else {
    await next();
  }
});

bot.launch()
  .then(() => {
    commands.init(bot);
    cron.init(bot);
    console.info('[BOT] has been started');
  })
  .catch((err) => {
    console.error('[ERROR] Launch error:', err);
    process.exit(0);
  });

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
