import { Markup, Scenes } from 'telegraf';
import { find } from 'lodash';
import request from '../../plugins/request';
import config from '../../config';
import metadata from './metadata';

const { stepsInfo } = metadata;
const setBarsCredentials = (userData) => request.post(`${config.apiUrl}/bars/setUser`, userData);

const handleMessage = async (ctx) => {
  const { text, reply_to_message: replyToMessage } = ctx.update.message;

  if (replyToMessage) {
    const stepInfo = find(stepsInfo, { title: replyToMessage.text });

    ctx.session[stepInfo.objectKey] = text;

    return true;
  }

  throw new Error('No "reply_to_message" found');
};

const handleReply = async (ctx, stepInfo) => {
  const replyOption = Markup.forceReply().placeholder(stepInfo.placeholder).selective(true);

  return ctx.replyWithMarkdown(`\`${stepInfo.title}\``, replyOption);
};

const step1 = async (ctx) => {
  const keyboard = Markup.inlineKeyboard([Markup.button.callback('Отмена', 'leaveScene')]);

  await ctx.replyWithMarkdown('*Данные, пока, хранятся в открытом виде*');
  await ctx.replyWithMarkdown('*Логин и пароль привязывается к аккаунту телеграма*', keyboard);
  await handleReply(ctx, stepsInfo[0]);

  return ctx.wizard.next();
};

const step2 = async (ctx) => handleMessage(ctx)
  .then(() => handleReply(ctx, stepsInfo[1]))
  .then(() => ctx.wizard.next())
  .catch(() => ctx.wizard.selectStep(ctx.wizard.cursor - 1));

const leaveScene = async (ctx) => {
  handleMessage(ctx)
    .then(() => {
      const { username, password } = ctx.session;

      if (username && password) {
        setBarsCredentials({ userId: ctx.update.message.from.id, username, password })
          .then(() => ctx.replyWithMarkdown('`Данные установлены`'))
          .catch(() => ctx.replyWithMarkdown('`Ошибка при попытке установки пользователя`'));
      } else {
        ctx.replyWithMarkdown('`Логин или пароль не были указаны`');
      }

      return ctx.scene.leave();
    })
    .catch(() => ctx.wizard.selectStep(ctx.wizard.cursor - 1));
};

const setBarsUserScene = new Scenes.WizardScene(
  'SET_BARS_CREDENTIALS',
  (ctx) => step1(ctx),
  step2,
  leaveScene
);

setBarsUserScene.action('leaveScene', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown('`Не хочешь, как хочешь, блин`', { reply_markup: { remove_keyboard: true } });

  return ctx.scene.leave();
});

export default setBarsUserScene;
