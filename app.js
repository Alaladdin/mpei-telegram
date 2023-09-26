import { Telegraf } from 'telegraf';
import createDebug from 'debug';
import { chain } from 'lodash';
import { contextMiddleware, sentryMiddleware } from './src/middleware';
import config from './src/config';
import events from './src/events';
import commands from './src/commands';
import cron from './src/cron';
import { getFolderModulesInfo, reportCrash } from './src/helpers';
import { COMMANDS_ORDER } from './src/constants';

const debug = createDebug('bot:main');
const bot = new Telegraf(config.token);

const init = async () => {
  const commandsList = chain(getFolderModulesInfo('commands'))
    .reject('hidden')
    .map(({ name, description }) => ({ command: name, description }))
    .orderBy(({ command }) => COMMANDS_ORDER[command] || 999)
    .value();

  await bot.telegram.setMyCommands(commandsList);

  bot.catch((err, ctx) => {
    debug(err, ctx);
    reportCrash(err);
  });

  bot.use(async (ctx, next) => {
    await contextMiddleware(ctx);
    await sentryMiddleware(ctx, next);
  });

  events.init(bot);
  commands.init(bot);
  cron.init(bot);

  await bot.launch();
};

init().catch(reportCrash);
