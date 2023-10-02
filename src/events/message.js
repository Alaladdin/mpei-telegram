import { RESTRICTED_USERS } from '../constants';

export default {
  name: 'message',
  async execute(ctx) {
    const userId = ctx.from.id;
    const userMessage = ctx.message.text;
    const isUserRestricted = RESTRICTED_USERS.includes(userId);
    const isMessageRestricted = userMessage.includes('dzen.ru') || userMessage.includes('clck.ru');

    if (isUserRestricted && isMessageRestricted) {
      ctx.deleteMessage(ctx.message.message_id);
      ctx.replyWithMarkdown('`Я запрещаю вам отправлять вам видосики из Здзена ✋`');
    }
  },
};
