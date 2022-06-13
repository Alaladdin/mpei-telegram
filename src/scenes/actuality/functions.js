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
      const { updatedAt, updatedBy } = actuality;
      const formattedUpdatedAt = formatDate(updatedAt);
      const updater = updatedBy ? (updatedBy.displayName || updatedBy.username) : 'DELETED USER';
      const updatedText = `*Обновлено ${formattedUpdatedAt} by ${updater}*`;

      return `${header}\n${updatedText}\n\n${actuality.data}`;
    }

    return `${header}\n\n\`Пусто 😔\``;
  });

export const getAdditionalKeyboardButtons = (section) => {
  const buttons = [Markup.button.callback('↺ Выбрать раздел', 'reEnterScene')];

  if (section)
    buttons.unshift(Markup.button.callback(`${section.name}`, `openSection:${section._id}`));

  return buttons;
};

export const handleEnterScene = async (ctx, callback) => {
  const actualitiesSections = await getActualitiesSections();
  const notEmptySections = reject(actualitiesSections, (section) => section.actualities && !section.actualities.length);
  const keyboardButtons = map(notEmptySections, ({ _id, name }) => Markup.button.callback(name, `openSection:${_id}`));
  const replyOptions = { parse_mode: 'markdown' };

  if (notEmptySections.length)
    assign(replyOptions, Markup.inlineKeyboard(keyboardButtons, { columns: 3 }));

  ctx.session.sections = notEmptySections;
  ctx.session.sectionId = null;
  ctx.session.actualityId = null;

  return callback(ctx, replyOptions);
};
