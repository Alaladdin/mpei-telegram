import { Markup, Scenes } from 'telegraf';
import { concat, find, map } from 'lodash';
import { getAdditionalKeyboardButtons, getFormattedActuality, handleEnterScene } from './functions';

const enterScene = async (ctx, isReEnter = false) => {
  await handleEnterScene(ctx, (newCtx, replyOptions) => {
    const { sections } = newCtx.session;
    const message = sections.length ? '`Выбери раздел`' : '`Все разделы пусты`';
    const action = isReEnter ? 'editMessageText' : 'reply';

    return ctx[action](message, replyOptions).catch(() => {});
  });
};

const actualityScene = new Scenes.WizardScene('ACTUALITY', (ctx) => enterScene(ctx, false));

actualityScene.action(/openSection/gi, async (ctx) => {
  const sectionId = ctx.update.callback_query.data.split(':')[1];
  const selectedSection = find(ctx.session.sections, { _id: sectionId });
  const baseKeyboardButtons = map(selectedSection.actualities, (actuality) => {
    const { _id, name } = actuality;

    return Markup.button.callback(name, `openActuality:${_id}`);
  });
  const keyboardButtons = concat(baseKeyboardButtons, getAdditionalKeyboardButtons());
  const replyOptions = {
    parse_mode: 'markdown',
    ...Markup.inlineKeyboard(keyboardButtons, {
      wrap: (button, i) => !(i % 3) || button.callback_data === 'reEnterScene',
    }),
  };

  ctx.session.sectionId = sectionId;
  ctx.session.selectedSection = selectedSection;

  return ctx.editMessageText(`*${selectedSection.name}*\n\n\`Выбери актуталочку\``, replyOptions)
    .then(() => ctx.answerCbQuery())
    .catch(() => {});
});

actualityScene.action(/openActuality/gi, async (ctx) => {
  const { selectedSection } = ctx.session;
  const actualityId = ctx.update.callback_query.data.split(':')[1];

  return getFormattedActuality(selectedSection, actualityId)
    .then((formattedActuality) => {
      const keyboardButtons = getAdditionalKeyboardButtons(selectedSection);
      const replyOptions = {
        parse_mode              : 'markdown',
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard(keyboardButtons, { columns: 1 }),
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

actualityScene.action('reEnterScene', async (ctx) => enterScene(ctx, true));

export default actualityScene;
