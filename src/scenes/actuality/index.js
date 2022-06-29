import { Scenes } from 'telegraf';
import { find, map } from 'lodash';
import { getKeyboard, getFormattedActuality, handleEnterScene } from './functions';
import actualityCommand from '../../commands/actuality';

const enterScene = async (ctx, isReEnter = false) => {
  await handleEnterScene(ctx, (newCtx, replyOptions) => {
    const { sections } = newCtx.session;
    const message = sections.length ? '`Выбери раздел`' : '`Все разделы пусты`';
    const action = isReEnter ? 'editMessageText' : 'reply';

    return ctx[action](message, replyOptions)
      .then((result) => {
        ctx.session.actualityMessageId = result.message_id;
      })
      .catch(() => {});
  });
};

const actualityScene = new Scenes.WizardScene('ACTUALITY', { ttl: 600 }, (ctx) => enterScene(ctx, false));

actualityScene.action(/openSection/gi, async (ctx) => {
  const sectionId = ctx.update.callback_query.data.split(':')[1];
  const section = find(ctx.session.sections, { _id: sectionId });
  const keyboardButtons = map(section.actualities, ({ _id, name }) => ([name, `openActuality:${_id}`]));
  const replyOptions = { parse_mode: 'markdown', ...getKeyboard(keyboardButtons) };

  ctx.session.sectionId = sectionId;
  ctx.session.section = section;

  return ctx.editMessageText(`*${section.name}*\n\n\`Выбери актуталочку\``, replyOptions)
    .then(() => ctx.answerCbQuery())
    .catch(() => {});
});

actualityScene.action(/openActuality/gi, async (ctx) => {
  const { section } = ctx.session;
  const actualityId = ctx.update.callback_query.data.split(':')[1];

  return getFormattedActuality(section, actualityId)
    .then((formattedActuality) => {
      const replyOptions = {
        parse_mode              : 'markdown',
        disable_web_page_preview: true,
        ...getKeyboard([[section.name, `openSection:${section._id}`]]),
      };

      return ctx.editMessageText(formattedActuality, replyOptions)
        .then(() => ctx.answerCbQuery())
        .catch(() => {});
    })
    .catch((err) => {
      ctx.answerCbQuery();
      ctx.replyWithMarkdown(`\`${err}\``);
    });
});

actualityScene.use((ctx, next) => {
  const { message, callback_query: callbackQuery } = ctx.update;
  const payload = callbackQuery ? callbackQuery.data : message.text;
  const actualityCommandName = `/${actualityCommand.name}`;

  const allowedPayloads = [actualityCommandName, 'reEnterScene', 'openSection', 'openActuality'];

  if (!allowedPayloads.includes(payload))
    return ctx.scene.leave();

  return next();
});

actualityScene.leave(async (ctx) => {
  await ctx.deleteMessage(ctx.session.actualityMessageId).catch(() => {});
  await ctx.replyWithMarkdown('`Завершаем работу с актуалочкой`');
});

actualityScene.action('reEnterScene', async (ctx) => enterScene(ctx, true));
actualityScene.action('leaveScene', async (ctx) => {
  ctx.answerCbQuery();

  return ctx.scene.leave();
});

export default actualityScene;
