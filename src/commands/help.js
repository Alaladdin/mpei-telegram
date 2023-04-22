import { chain } from 'lodash';
import { getFolderModulesInfo } from '../helpers';
import { COMMANDS_ORDER } from '../constants';

export default {
  name       : 'help',
  description: 'Информация по командам',
  async execute(ctx) {
    const commandsInfoText = chain(getFolderModulesInfo('commands'))
      .reject('hidden')
      .orderBy(({ name }) => COMMANDS_ORDER[name] || 999)
      .map((commandInfo) => {
        const { name, description } = commandInfo;
        const info = [];

        info.push(`Команда: /${name}`);
        info.push(`Описание: ${description}`);

        return info.join('\n');
      })
      .value()
      .join('\n\n');

    await ctx.replyWithMarkdown(`\`${commandsInfoText}\``);
  },
};
