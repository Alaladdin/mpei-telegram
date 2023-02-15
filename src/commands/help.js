import map from 'lodash/map';
import { getFolderModulesInfo } from '../helpers';

export default {
  name       : 'help',
  description: 'Информация по командам',
  async execute(ctx) {
    const commandsInfo = getFolderModulesInfo('commands');
    const commandsInfoText = map(commandsInfo, (commandInfo) => {
      const { name, description } = commandInfo;
      const info = [];

      info.push(`Команда: /${name}`);
      info.push(`Описание: ${description}`);

      return info.join('\n');
    }).join('\n\n');

    await ctx.replyWithMarkdownV2(`\`${commandsInfoText}\``);
  },
};
