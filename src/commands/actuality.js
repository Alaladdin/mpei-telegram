import { Markup } from 'telegraf';
import config from '../config';

export default {
  name       : 'a',
  description: 'Актуалочка',
  execute    : (ctx, bot) => {
    const keyboard = Markup.inlineKeyboard([
      Markup.button.webApp('Актуалочка', `${config.webAppUrl}actuality`),
    ]);
    const replyOptions = { parse_mode: 'Markdown', ...keyboard };

    ctx.reply('`Winx systems`', replyOptions)
      .catch(() => bot.telegram.sendMessage(config.mainChatId, '`Winx systems`', replyOptions))
      .catch(() => {});
  },
};
