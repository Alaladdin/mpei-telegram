import map from 'lodash/map';
import { getFolderModulesInfo } from '../helpers';
import config from '../config';

export default {
  name       : 'start',
  description: 'Обновление списка команд',
  async execute(ctx) {
    const commandsInfo = getFolderModulesInfo('commands');
    const commandsList = map(commandsInfo, ({ name, description }) => ({ command: name, description }));

    await ctx.setMyCommands(commandsList);
    await ctx.setChatMenuButton({ type: 'web_app', text: 'Winx systems', web_app: { url: config.webAppUrl } });
    await ctx.replyWithMarkdown(`\`Приветствую, ${ctx.username}\``);
  },
};
