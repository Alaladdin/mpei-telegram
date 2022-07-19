import each from 'lodash/each';
import filter from 'lodash/filter';
import { getFolderModulesInfo } from '../helpers';

export default {
  init(bot) {
    const commandsInfo = getFolderModulesInfo('commands');
    const actions = filter(commandsInfo, 'actionNames');

    each(commandsInfo, (command) => {
      bot.command(command.name, (ctx) => command.execute(ctx, bot));
    });

    each(actions, (action) => {
      each(action.actionNames, (actionName) => {
        bot.action(actionName, (ctx) => action.executeAction(ctx));
      });
    });
  },
};
