import { Markup } from 'telegraf';

export default {
  name       : 'a',
  description: 'Актуалочка',
  execute    : (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      Markup.button.webApp('Актуалочка', 'https://winx.mpei.space/actuality'),
    ]);

    ctx.replyWithMarkdown('`Winx systems`', keyboard)
      .catch((err) => ctx.replyWithMarkdown(`\`${err}\``));
  },
};
