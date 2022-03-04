import { map } from 'lodash';
import { getCommandsInfo } from '../helpers';

export default {
  name       : 'start',
  description: 'Обновление списка команд',
  async execute(ctx) {
    const commandsInfo = getCommandsInfo();
    const commandsList = map(commandsInfo, ({ name, description }) => ({ command: name, description }));
    const { first_name: username } = ctx.update.message.from;

    ctx.setMyCommands(commandsList);
    await ctx.replyWithMarkdown(`\`Приветствую, ${username}\``);
  },
};
