import { map } from 'lodash';
import packageJSON from '../../package.json';

export default {
  name       : 'debug',
  description: 'Обновление списка команд',
  async execute(ctx) {
    const fieldsInfo = [
      {
        title : 'bot',
        fields: [
          { title: 'version', value: packageJSON.version },
          { title: 'sentryName', value: ctx.sentryName },
          { title: 'sentryOperation', value: ctx.sentryOperation },
        ],
      },
      {
        title : 'chat',
        fields: [
          { title: 'id', value: ctx.chatId },
          { title: 'isPrivateChat', value: ctx.isPrivateChat },
        ],
      },
      {
        title : 'user',
        fields: [
          { title: 'id', value: ctx.userId },
          { title: 'username', value: ctx.username },
          { title: 'isAdmin', value: ctx.isAdmin },
        ],
      },
    ];

    const debugMessage = map(fieldsInfo, (info) => {
      const message = [`*# ${info.title}*`];

      message.push(...map(info.fields, (field) => `\`${field.title}: ${field.value}\``));

      return message.join('\n');
    }).join('\n\n');

    await ctx.replyWithMarkdown(debugMessage);
  },
};
