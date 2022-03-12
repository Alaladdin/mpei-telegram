import { formatDate } from '../helpers';
import config from '../../config';
import request from '../plugins/request';

export default {
  name       : 'a',
  description: 'Актуалочка',
  arguments  : [{ name: 'lazy', description: 'несрочная' }],
  async execute(ctx, args) {
    const actuality = await this.getActuality();

    if (!actuality.error) {
      const actualityInfo = this.getActualityInfo(actuality, args);

      if (actualityInfo.text) {
        const message = [`*${actualityInfo.title}*`, actualityInfo.text].join('\n\n');

        return ctx.replyWithMarkdown(message);
      }

      return ctx.replyWithMarkdown(`\`${actualityInfo.noDataTitle}\``);
    }

    return ctx.replyWithMarkdown(`\`Error: ${actuality.error}\``);
  },
  getActualityInfo(actuality, args) {
    const isLazy = args.includes('lazy');
    const { updatedAt, updatedBy, content, lazyContent } = actuality;
    const formattedUpdatedAt = formatDate(updatedAt);
    const updatedByText = (updatedBy && updatedBy.username) || 'DELETED USER';
    const updatedText = `Обновлено ${formattedUpdatedAt} by ${updatedByText}`;

    const info = {
      main: {
        title      : `Актуалочка. ${updatedText}`,
        noDataTitle: 'Актуалочка пуста',
        text       : content,
      },
      lazy: {
        title      : `Несрочная актуалочка. ${updatedText}`,
        noDataTitle: 'Несрочная актуалочка пуста',
        text       : lazyContent,
      },
    };

    return isLazy ? info.lazy : info.main;
  },
  getActuality: () => request.get(`${config.apiUrl}/getActuality`)
    .then((data) => data.actuality)
    .catch((err) => err),
};
