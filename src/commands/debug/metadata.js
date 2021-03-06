import packageJSON from '../../../package.json';
import config from '../../config';

export default (ctx) => ({
  fieldsInfo: [
    {
      title : 'bot',
      fields: [
        { title: 'version', value: packageJSON.version },
        { title: 'mainChatId', value: config.mainChatId },
        { title: 'adminChatId', value: config.adminChatId },
        { title: 'operationPayload', value: ctx.operationPayload },
        { title: 'operation', value: ctx.operation },
        { title: 'isProd', value: config.isProd },
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
  ],
});
