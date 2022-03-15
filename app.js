import { Telegraf } from 'telegraf';
import { contextMiddleware } from './src/middleware';
import config from './config';
import commands from './src/commands';
import actions from './src/actions';
import cron from './src/cron';
import { initStore } from './src/store';

const bot = new Telegraf(config.token);

bot.use(async (ctx, next) => {
  await contextMiddleware(ctx);
  await next();
});

bot.launch()
  .then(initStore)
  .then(() => {
    actions.init(bot);
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
