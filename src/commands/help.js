import { map } from 'lodash';
import { getCommandsInfo } from '../helpers';

export default {
  name       : 'help',
  description: 'Информация по командам',
  async execute(ctx) {
    const commandsInfo = getCommandsInfo();
    const commandsInfoText = map(commandsInfo, (commandInfo) => {
      const { name, description } = commandInfo;
      const info = [];

      info.push(`Команда: /${name}`);
      info.push(`Описание: ${description}`);

      return info.join('\n');
    }).join('\n\n');

    await ctx.replyWithMarkdown(`\`${commandsInfoText}\``);
  },
};
