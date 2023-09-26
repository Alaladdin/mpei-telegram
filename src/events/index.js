import each from 'lodash/each';
import { getFolderModulesInfo } from '../helpers';

export default {
  init(bot) {
    const eventsInfo = getFolderModulesInfo('events');

    each(eventsInfo, (event) => {
      bot.on(event.name, (ctx) => event.execute(ctx, bot));
    });
  },
};
