import map from 'lodash/map';
import { getFolderModulesInfo } from '../helpers';

export default {
  name       : 'start',
  description: 'Обновление списка команд',
  async execute(ctx) {
    const commandsInfo = getFolderModulesInfo('commands');
    const commandsList = map(commandsInfo, ({ name, description }) => ({ command: name, description }));

    await ctx.setMyCommands(commandsList);
    await ctx.replyWithMarkdown(`\`Приветствую, ${ctx.username}\``);
  },
};
