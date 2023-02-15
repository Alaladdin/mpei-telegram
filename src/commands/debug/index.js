import map from 'lodash/map';
import metadataFunc from './metadata';

export default {
  name       : 'debug',
  description: 'Отладочная информация',
  async execute(ctx) {
    const metadata = metadataFunc(ctx);
    const debugMessage = map(metadata.fieldsInfo, (info) => {
      const message = [`*# ${info.title}*`];

      message.push(...map(info.fields, (field) => `\`${field.title}: ${field.value}\``));

      return message.join('\n');
    }).join('\n\n');

    await ctx.replyWithMarkdownV2(debugMessage);
  },
};
