import each from 'lodash/each';
import { getCommandsInfo } from '../helpers';

export default {
  init(bot) {
    const commandsInfo = getCommandsInfo();

    each(commandsInfo, (command) => {
      bot.command(command.name, (ctx) => this.callCommand(command, ctx));
    });
  },
  callCommand(command, ctx) {
    const message = ctx.update.message.text.toLowerCase();
    const args = message.split(' ').slice(1);

    command.execute(ctx, args);
  },
};
