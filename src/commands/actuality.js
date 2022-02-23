import axios from 'axios';
import { formatDate } from '../helpers';
import { apiRequestsMap } from '../data';

export default {
  name       : 'a',
  description: 'Актуалочка',
  arguments  : [{ name: 'lazy', description: 'несрочная' }],
  async execute(ctx, args) {
    const actuality = await this.getActuality();
    const actualityInfo = this.getActualityInfo(actuality, args);

    if (actualityInfo.text) {
      const message = [actualityInfo.title, actualityInfo.text].join('\n\n');

      return ctx.replyWithMarkdown(`\`${message}\``);
    }

    return ctx.replyWithMarkdown(`\`${actualityInfo.noDataTitle}\``);
  },
  getActualityInfo(actuality, args) {
    const isLazy = args.includes('lazy');
    const updatedAt = formatDate(actuality.updatedAt);
    const info = {
      main: {
        title      : `Актуалочка. Обновлено: ${updatedAt}`,
        noDataTitle: 'Актуалочка пуста',
        text       : actuality.content,
      },
      lazy: {
        title      : `Несрочная актуалочка. Обновлено: ${updatedAt}`,
        noDataTitle: 'Несрочная актуалочка пуста',
        text       : actuality.lazyContent,
      },
    };

    return isLazy ? info.lazy : info.main;
  },
  getActuality: () => axios.get(apiRequestsMap.getActuality)
    .then((res) => res.data.actuality)
    .catch((err) => {
      console.error(err);

      throw err;
    }),
};
