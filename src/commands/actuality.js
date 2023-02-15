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
      .catch(() => bot.telegram.sendMessage(ctx.userId, '`Winx systems`', replyOptions))
      .catch(() => {
        ctx.replyWithMarkdownV2('`Команда работает только в личных сообщениях`');
      });
  },
};
