import {
    RESTRICTED_USERS
} from '../constants';

export default {
    name: 'message',
    async execute(ctx) {
        const userId = ctx.from.id;
        const userMessage = ctx.message.text;
        const isUserRestricted = RESTRICTED_USERS.includes(userId);

        if (isUserRestricted) {
            const isMessageWithDzenLink = userMessage.includes('dzen.ru') || userMessage.includes('clck.ru');
            const isMessageWithYouTubeLink = userMessage.includes('youtube.');

            if (isMessageWithDzenLink) {
                ctx.deleteMessage(ctx.message.message_id);
                ctx.replyWithMarkdown('`Я запрещаю вам отправлять вам видосики из Дзена ✋`');
            } else if (isMessageWithYouTubeLink) {
                ctx.deleteMessage(ctx.message.message_id);
                ctx.replyWithMarkdown('`Я запрещаю вам отправлять вам видосики из Ютуба ✋`');
            }
        },
    }
};
