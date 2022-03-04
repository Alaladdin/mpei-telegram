import { Telegraf } from 'telegraf';
import config from './config';
import commands from './src/commands';
import cron from './src/cron';

const bot = new Telegraf(config.token);

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
