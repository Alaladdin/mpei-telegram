import { map } from 'lodash';
import { getCommandsInfo } from '../helpers';

export default {
  name       : 'start',
  description: 'Обновление списка команд',
  execute(ctx) {
    const commandsInfo = getCommandsInfo();
    const commandsList = map(commandsInfo, ({ name, description }) => ({ command: name, description }));

    ctx.setMyCommands(commandsList);
    ctx.replyWithMarkdown('`Список команд обновлен`');
  },
};
