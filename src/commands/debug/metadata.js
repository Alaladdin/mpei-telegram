import { map } from 'lodash';
import { version } from '../../../package.json';
import config from '../../config';
import { EMPTY_VALUE } from '../../constants';

const formatField = (field) => ({ ...field, value: field.value ?? EMPTY_VALUE });

export default (ctx) => {
  const { botInfo, from, chat } = ctx;
  const chatTitle = chat.title || ctx.fullName;
  const fullName = [from.first_name, from.last_name].join(' ');

  return {
    fieldsInfo: [
      {
        title : 'bot',
        fields: map([
          { title: 'version', value: version },
          { title: 'name', value: botInfo.first_name },
          { title: 'username', value: `@${botInfo.username}` },
          { title: 'mainChatId', value: config.mainChatId },
          { title: 'environment', value: config.currentEnv },
        ], formatField),
      },
      {
        title : 'chat',
        fields: map([
          { title: 'id', value: chat.id },
          { title: 'title', value: chatTitle },
          { title: 'type', value: chat.type },
        ], formatField),
      },
      {
        title : 'user',
        fields: map([
          { title: 'id', value: from.id },
          { title: 'username', value: from.username && `@${from.username}` },
          { title: 'fullName', value: fullName },
          { title: 'lang', value: from.language_code },
          { title: 'isPremium', value: from.is_premium },
        ], formatField),
      },
    ],
  };
};
