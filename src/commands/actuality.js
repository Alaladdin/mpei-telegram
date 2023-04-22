import { Markup } from 'telegraf';
import config from '../config';

export default {
  name       : 'a',
  description: 'Актуалочка',
  execute    : (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      // Markup.button.webApp('Актуалочка', `${config.webAppUrl}actuality`),
      Markup.button.url('Актуалочка', `${config.webAppUrl}/actuality`),
    ]);

    ctx.replyWithMarkdownV2('`Winx systems`', keyboard);
  },
};
