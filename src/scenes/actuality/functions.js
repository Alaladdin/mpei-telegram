import { Markup } from 'telegraf';
import { assign, map, reject } from 'lodash';
import request from '../../plugins/request';
import config from '../../config';
import { formatDate } from '../../helpers';

const getActualitiesSections = () => request.get(`${config.apiUrl}/getActualitiesSections`)
  .then((data) => data.sections)
  .catch((errorData) => {
    throw errorData.error;
  });

const getActuality = (actualityId) => request.get(`${config.apiUrl}/getActuality`, { params: { actualityId } })
  .then((data) => data.actuality)
  .catch((errorData) => {
    throw errorData.error;
  });

export const getFormattedActuality = async (section, actualityId) => getActuality(actualityId)
  .then((actuality) => {
    const header = `*${section.name}/${actuality.name}*`;

    if (actuality.data) {
      const { updatedBy, updatedAt } = actuality;
      const updater = updatedBy ? (updatedBy.displayName || updatedBy.username) : 'DELETED USER';
      const updatedText = `*Обновлено ${formatDate(updatedAt)} by ${updater}*`;

      return `${header}\n${updatedText}\n\n${actuality.data}`;
    }

    return `${header}\n\n\`Пусто 😔\``;
  });

const getButton = (...args) => Markup.button.callback(...args);

export const getKeyboard = (buttons = [], isHideReEnter = false) => {
  const keyboardButtons = map(buttons, (button) => getButton(...button));
  const options = { wrap: (button, i) => !(i % 3) || ['reEnterScene', 'leaveScene'].includes(button.callback_data) };

  if (!isHideReEnter)
    keyboardButtons.push(getButton('↺ Выбрать раздел', 'reEnterScene'));

  keyboardButtons.push(getButton('X Выйти', 'leaveScene'));

  return Markup.inlineKeyboard(keyboardButtons, options);
};

export const handleEnterScene = async (ctx, callback) => {
  const actualitiesSections = await getActualitiesSections();
  const notEmptySections = reject(actualitiesSections, (section) => !section.actualities.length);
  const replyOptions = { parse_mode: 'markdown' };

  if (notEmptySections.length) {
    const keyboardButtons = map(notEmptySections, ({ _id, name }) => ([name, `openSection:${_id}`]));

    assign(replyOptions, getKeyboard(keyboardButtons, true));
  }

  ctx.session.sections = notEmptySections;
  ctx.session.sectionId = null;
  ctx.session.actualityId = null;
  ctx.session.actualityMessageId = null;

  return callback(ctx, replyOptions);
};
