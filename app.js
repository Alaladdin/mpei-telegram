import { Telegraf } from 'telegraf';
import config from './config';
import commands from './src/commands';

const bot = new Telegraf(config.token);

commands.init(bot);

bot.launch().then(() => {
  console.info('[BOT] has been started');
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
