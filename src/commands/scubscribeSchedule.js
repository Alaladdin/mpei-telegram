import { Markup } from 'telegraf';

export default {
  name       : 'ss',
  actionName : 'subscribeSchedule',
  description: 'Уведомления перед парой',
  async execute(ctx) {
    const messageData = this.getMessageData(ctx);

    await ctx.replyWithMarkdown(...messageData);
  },
  async executeAction(ctx) {
    if (ctx.isPrivateChat || ctx.isAdmin) {
      const isNotifyEnabled = this.getIsNotifyEnabled(ctx.chatId);

      // eslint-disable-next-line no-unused-expressions
      isNotifyEnabled
        ? store.reject('scheduleSubscribers', ctx.chatId)
        : store.push('scheduleSubscribers', ctx.chatId);

      const messageData = this.getMessageData(ctx);

      ctx.answerCbQuery();

      return ctx.editMessageText(...messageData)
        .catch(() => {});
    }

    ctx.answerCbQuery();

    return ctx.replyWithMarkdown('`Только администраторы могут менять подписку чата`');
  },
  getMessageData(ctx) {
    const isNotifyEnabled = this.getIsNotifyEnabled(ctx.chatId);
    const currentStatusText = `Статус: ${isNotifyEnabled ? 'включены' : 'выключены'}`;
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback(currentStatusText, 'subscribeSchedule'),
    ]);

    return ['Уведомления перед парой', keyboard];
  },
  getIsNotifyEnabled(chatId) {
    const currentSubscribers = store.get('scheduleSubscribers');

    return !!currentSubscribers && currentSubscribers.includes(chatId);
  },
};
