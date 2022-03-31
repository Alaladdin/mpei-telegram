import { Markup } from 'telegraf';
import { formatDate } from '../helpers';
import config from '../../config';
import request from '../plugins/request';

export default {
  name         : 'a',
  description  : 'Актуалочка',
  actionNames  : ['toggleActualityType'],
  actualityType: 'content',
  async execute(ctx) {
    this.actualityType = 'content';

    return this.sendActuality(ctx);
  },
  async executeAction(ctx) {
    this.actualityType = this.actualityType === 'content' ? 'lazyContent' : 'content';

    return this.sendActuality(ctx, true);
  },
  async sendActuality(ctx, isEdit = false) {
    const actuality = await this.getActuality();

    if (!actuality.error) {
      const actualityInfo = this.getActualityInfo(actuality);
      const message = [`*${actualityInfo.title}*`, actualityInfo.data || '`Пусто 😔`'].join('\n\n');
      const replyOptions = this.getReplyOptionsKeyboard();

      if (!isEdit)
        return ctx.reply(message, replyOptions).catch((err) => ctx.replyWithMarkdown(`\`${err}\``));

      return ctx.editMessageText(message, replyOptions).catch(() => {});
    }

    return ctx.replyWithMarkdown(`\`Error: ${actuality.error}\``);
  },
  getActuality: () => request.get(`${config.apiUrl}/getActuality`)
    .then((data) => data.actuality)
    .catch((err) => err),
  getActualityInfo(actuality) {
    const { updatedAt, updatedBy, content, lazyContent } = actuality;
    const formattedUpdatedAt = formatDate(updatedAt);
    const updater = updatedBy ? (updatedBy.displayName || updatedBy.username) : 'DELETED USER';
    const updatedText = `Обновлено ${formattedUpdatedAt} by ${updater}`;

    const info = {
      main: { title: `Актуалочка. ${updatedText}`, data: content },
      lazy: { title: `Несрочная актуалочка. ${updatedText}`, data: lazyContent },
    };

    return this.actualityType === 'lazyContent' ? info.lazy : info.main;
  },
  getReplyOptionsKeyboard() {
    const buttonText = this.actualityType === 'content' ? 'Несрочная' : 'Основная';
    const keyboard = Markup.inlineKeyboard([Markup.button.callback(buttonText, 'toggleActualityType')]);

    return { parse_mode: 'Markdown', disable_web_page_preview: true, ...keyboard };
  },
};
