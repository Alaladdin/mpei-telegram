import { map } from 'lodash';
import { getCommandsInfo, getRandomArrayItem } from '../helpers';
import { phrases } from '../data';

export default {
  name       : 'start',
  description: 'Обновление списка команд',
  execute(ctx) {
    const commandsInfo = getCommandsInfo();
    const commandsList = map(commandsInfo, ({ name, description }) => ({ command: name, description }));
    const greeting = getRandomArrayItem(phrases.greetings);

    ctx.setMyCommands(commandsList);
    ctx.replyWithMarkdown(greeting);
  },
};
