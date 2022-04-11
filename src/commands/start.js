import { map } from 'lodash';
import { getCommandsInfo } from '../helpers';

export default {
  name       : 'start',
  description: 'Обновление списка команд',
  async execute(ctx) {
    const commandsInfo = getCommandsInfo();
    const commandsList = map(commandsInfo, ({ name, description }) => ({ command: name, description }));

    await ctx.setMyCommands(commandsList);
    await ctx.replyWithMarkdown(`\`Приветствую, ${ctx.username}\``);
  },
};
