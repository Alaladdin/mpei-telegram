import { Scenes, session, Telegraf } from 'telegraf';
import { contextMiddleware, sentryMiddleware } from './src/middleware';
import config from './src/config';
import commands from './src/commands';
import cron from './src/cron';
import actualityScene from './src/scenes/actuality';

const bot = new Telegraf(config.token);
const scenes = new Scenes.Stage([actualityScene]);

bot.use(session());
bot.use(scenes.middleware());
bot.use(async (ctx, next) => {
  await contextMiddleware(ctx);
  await sentryMiddleware(ctx, next);
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
