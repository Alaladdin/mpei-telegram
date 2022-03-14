import path from 'path';
import fs from 'fs';
import { filter, map, each } from 'lodash';
import { getCommandsInfo } from '../helpers';

export default {
  init(bot) {
    const actionsInfo = this.getActionsInfo();
    const commandsInfo = getCommandsInfo();
    const commandsWithActions = filter(commandsInfo, (command) => command.actionName);

    each(actionsInfo, (action) => {
      bot.action(action.name, (ctx) => action.execute(ctx));
    });

    each(commandsWithActions, (action) => {
      bot.action(action.actionName, (ctx) => action.executeAction(ctx));
    });
  },
  getActionsInfo() {
    const actionsFolderData = fs.readdirSync(__dirname);
    const actionsList = filter(actionsFolderData, (itemName) => itemName !== 'index.js');

    return map(actionsList, (actionPath) => {
      const actionFilePath = path.resolve(__dirname, actionPath);

      // eslint-disable-next-line global-require,import/no-dynamic-require
      return require(actionFilePath).default;
    });
  },
};
