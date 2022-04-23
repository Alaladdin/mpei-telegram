import { Markup, Scenes } from 'telegraf';
import { concat, find, map, reject } from 'lodash';
import request from '../plugins/request';
import config from '../config';
import { formatDate } from '../helpers';

const actualityScene = new Scenes.BaseScene('ACTUALITY');

const getActualitiesSections = () => request.get(`${config.apiUrl}/getActualitiesSections`)
  .then((data) => data.sections)
  .catch((err) => err);

const getActuality = (actualityId) => request.get(`${config.apiUrl}/getActuality`, { params: { actualityId } })
  .then((data) => data.actuality)
  .catch((err) => err);

const getFormattedActuality = async (parentSection, actualityId) => {
  const actuality = await getActuality(actualityId);
  const header = `${parentSection.name}/${actuality.name}`;

  if (actuality.data) {
    const { updatedAt, updatedBy } = actuality;
    const formattedUpdatedAt = formatDate(updatedAt);
    const updater = updatedBy ? (updatedBy.displayName || updatedBy.username) : 'DELETED USER';
    const updatedText = `Обновлено ${formattedUpdatedAt} by ${updater}`;

    return `${header}\n${updatedText}\n\n${actuality.data}`;
  }

  return `${header}\n\nПусто 😔`;
};

const getAdditionalKeyboardButtons = (section) => {
  const buttons = [Markup.button.callback('↺ Выбрать раздел', 'reenter')];

  if (section)
    buttons.unshift(Markup.button.callback(`← ${section.name}`, `openSection:${section._id}`));

  return buttons;
};

actualityScene.enter(async (ctx) => {
  const actualitiesSections = await getActualitiesSections();
  const notEmptySections = reject(actualitiesSections, (section) => section.actualities && !section.actualities.length);
  const keyboardButtons = map(notEmptySections, ({ _id, name }) => Markup.button.callback(name, `openSection:${_id}`));

  ctx.session.sections = notEmptySections;
  ctx.session.sectionId = null;
  ctx.session.actualityId = null;

  if (notEmptySections.length) {
    ctx.replyWithMarkdown('`Выбери раздел`', Markup.inlineKeyboard(keyboardButtons, { columns: 3 }))
      .then((result) => {
        ctx.session.messageId = result.message_id;
      });
  } else {
    ctx.replyWithMarkdown('`Все разделы пусты`');
  }
});

actualityScene.action(/openSection/gi, async (ctx) => {
  const sectionId = ctx.update.callback_query.data.split(':')[1];
  const selectedSection = find(ctx.session.sections, { _id: sectionId });
  const baseKeyboardButtons = map(
    selectedSection.actualities,
    ({ _id, name }) => Markup.button.callback(name, `openActuality:${_id}`)
  );
  const keyboardButtons = concat(baseKeyboardButtons, getAdditionalKeyboardButtons());
  const replyOptions = {
    parse_mode: 'markdown',
    ...Markup.inlineKeyboard(keyboardButtons, {
      wrap: (button, i) => !(i % 3) || button.callback_data === 'reenter',
    }),
  };

  ctx.session.sectionId = sectionId;
  ctx.session.selectedSection = selectedSection;

  return ctx.editMessageText('`Выбери актуталочку`', replyOptions)
    .then(() => ctx.answerCbQuery())
    .catch(() => {});
});

actualityScene.action(/openActuality/gi, async (ctx) => {
  const actualityId = ctx.update.callback_query.data.split(':')[1];
  const formattedActuality = await getFormattedActuality(ctx.session.selectedSection, actualityId);
  const keyboard = getAdditionalKeyboardButtons(ctx.session.selectedSection);
  const replyOptions = { parse_mode: 'markdown', ...Markup.inlineKeyboard(keyboard, { columns: 1 }) };

  return ctx.editMessageText(`\`${formattedActuality}\``, replyOptions)
    .then(() => ctx.answerCbQuery())
    .catch(() => {});
});

actualityScene.action('reenter', async (ctx) => ctx.scene.reenter());

actualityScene.leave((ctx) => {
  const { messageId } = ctx.session;

  if (messageId)
    ctx.deleteMessage(ctx.session.messsageId).catch(() => {});
});

export default actualityScene;
