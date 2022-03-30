import { some } from 'lodash';

export default async (ctx) => {
  const { message, callback_query: callbackQuery } = ctx.update;
  const data = message || callbackQuery;

  if (data) {
    const chat = data.message ? data.message.chat : data.chat;

    ctx.sentryName = data.data || data.text;
    ctx.sentryOpearation = data.data ? 'action' : 'command';
    ctx.chatId = chat.id;
    ctx.isPrivateChat = chat.type === 'private';
    ctx.userId = data.from.id;
    ctx.username = data.from.first_name;
    ctx.isAdmin = false;

    if (!ctx.isPrivateChat) {
      const chatAdministrators = await ctx.getChatAdministrators(ctx.chatId);

      ctx.isAdmin = some(chatAdministrators, (admin) => admin.user.id === ctx.userId);
    }
  }
};
