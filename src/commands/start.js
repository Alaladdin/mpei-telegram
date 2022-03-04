import { map } from 'lodash';
import { getCommandsInfo } from '../helpers';

export default {
  name       : 'start',
  description: 'Обновление списка команд',
  execute(ctx) {
    const commandsInfo = getCommandsInfo();
    const commandsList = map(commandsInfo, ({ name, description }) => ({ command: name, description }));
    const { first_name: username } = ctx.update.message.from;

    ctx.setMyCommands(commandsList);
    ctx.replyWithMarkdown(`\`Приветствую, ${username}\``);
  },
};
