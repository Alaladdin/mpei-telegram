import { Markup, Scenes } from 'telegraf';
import setBarsCredentialsCommand from '../commands/setBarsCredentials';

const setBarsCredentials = setBarsCredentialsCommand.setBarsCredentials;

const enterScene = async (ctx) => {
  const keyboard = Markup.inlineKeyboard([Markup.button.callback('Отмена', 'leaveScene')]);

  await ctx.replyWithMarkdown('*Данные, пока, хранятся в открытом виде*');
  await ctx.replyWithMarkdown('*Логин и пароль привязываются к аккаунту телеграма*', keyboard);
  await ctx.replyWithMarkdown('`Отправь мне логин и пароль от барса в формате`\n`username : password`');

  return ctx.wizard.next();
};

const handleCredentials = async (ctx) => {
  const currentStep = ctx.wizard.cursor;
  const message = ctx.update.message.text;
  const [username, password] = message.split(':');

  if (username && password) {
    ctx.session.username = username.trim();
    ctx.session.password = password.trim();

    return ctx.wizard.steps[currentStep + 1](ctx);
  }

  await ctx.replyWithMarkdown('`Необходимый формат — ``username : password`');

  return ctx.wizard.selectStep(currentStep);
};

const leaveScene = async (ctx) => {
  const { username, password } = ctx.session;
  const userId = ctx.update.message.from.id;

  if (username && password) {
    setBarsCredentials({ userId, username, password })
      .then(() => ctx.replyWithMarkdown('`Данные установлены`'))
      .catch(() => ctx.replyWithMarkdown('`Ошибка установки данных`'));
  } else {
    await ctx.replyWithMarkdown('`Логин или пароль не были указаны`');
  }

  return ctx.scene.leave();
};

// SCENE
const setBarsUserScene = new Scenes.WizardScene('SET_BARS_CREDENTIALS', enterScene, handleCredentials, leaveScene);

setBarsUserScene.action('leaveScene', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown('`Не хочешь, как хочешь, блин нафик`');

  return ctx.scene.leave();
});

export default setBarsUserScene;
