import each from 'lodash/each';
import { filter } from 'lodash';
import { getCommandsInfo } from '../helpers';

export default {
  init(bot) {
    const commandsInfo = getCommandsInfo();
    const actions = filter(commandsInfo, (command) => command.actionName);

    each(commandsInfo, (command) => {
      bot.command(command.name, (ctx) => this.callCommand(command, ctx));
    });

    each(actions, (action) => {
      bot.action(action.actionName, (ctx) => action.executeAction(ctx));
    });
  },
  callCommand(command, ctx) {
    const message = ctx.update.message.text.toLowerCase();
    const args = message.split(' ').slice(1);

    command.execute(ctx, args);
  },
};
