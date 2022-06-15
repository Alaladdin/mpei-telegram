import { Markup } from 'telegraf';
import { map } from 'lodash';
import request from '../plugins/request';
import config from '../config';
import getBarsMarksCommand from './bars';

const getKeyboardInfo = (isUserExists) => {
  if (!isUserExists)
    return [{ title: 'Установить данные', actionName: 'setBarsCredentials' }];

  return [
    { title: 'Изменить данные', actionName: 'setBarsCredentials' },
    { title: 'Удалить данные', actionName: 'removeBarsCredentials' },
  ];
};

export default {
  name       : 'sb',
  description: 'Управление данными барса',
  actionNames: ['setBarsCredentials', 'removeBarsCredentials'],
  async execute(ctx) {
    if (ctx.isPrivateChat) {
      const replyMessage = await this.getReplyData(ctx);

      return ctx.replyWithMarkdown(...replyMessage);
    }

    return ctx.replyWithMarkdown('`Команда работает только в личных сообщениях`');
  },
  async getReplyData(ctx, additionalOptions = {}) {
    const barsUserUsername = await getBarsMarksCommand.getUser(ctx.userId)
      .then((userData) => userData.username)
      .catch(() => null);

    const message = `Пользователь: ${barsUserUsername || 'не установлен'}`;
    const rawButtons = getKeyboardInfo(!!barsUserUsername);
    const buttons = map(rawButtons, (button) => Markup.button.callback(button.title, button.actionName));
    const keyboard = Markup.inlineKeyboard(buttons);

    return [`\`${message}\``, { ...keyboard, ...additionalOptions }];
  },
  async executeAction(ctx) {
    const actionName = ctx.update.callback_query.data;

    await ctx.answerCbQuery();

    if (actionName === 'setBarsCredentials')
      return ctx.scene.enter('SET_BARS_CREDENTIALS');

    return this.removeBarsCredentials(ctx.userId)
      .then(async () => {
        const replyMessage = await this.getReplyData(ctx, { parse_mode: 'Markdown' });

        await ctx.replyWithMarkdown('`Ваше желание исполнено`');
        ctx.editMessageText(...replyMessage);
      })
      .catch(() => {
        ctx.replyWithMarkdown('`Какая-то, невиданная прежде, ошибка. Понимаю, в это сложно поверить`');
      });
  },
  setBarsCredentials   : (credentials) => request.post(`${config.apiUrl}/bars/setUser`, credentials),
  removeBarsCredentials: (userId) => request.delete(`${config.apiUrl}/bars/removeUser`, { data: { userId } }),
};
