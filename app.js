import { Telegraf } from 'telegraf';
import config from './config';
import commands from './src/commands';
import actions from './src/actions';
import cron from './src/cron';
import { initStore } from './src/store';

const bot = new Telegraf(config.token);

bot.use(async (ctx, next) => {
  const { message, callback_query: callbackQuery } = ctx.update;
  const data = message || callbackQuery;

  if (data) {
    ctx.username = data.from.first_name;
    ctx.userId = data.from.id;
    ctx.chatId = data.message ? data.message.chat.id : data.chat.id;
  }

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
