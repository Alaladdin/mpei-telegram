import { map, memoize, debounce } from 'lodash';
import { Markup } from 'telegraf';
import { formatDate, getScheduleDate } from '../../helpers';
import request from '../../plugins/request';
import config from '../../../config';

const keyboard = Markup.inlineKeyboard([
  Markup.button.callback('сюдым', 'schedulePrevWeek'),
  Markup.button.callback('тудым', 'scheduleNextWeek'),
]);

export default {
  name       : 's',
  description: 'Расписание',
  actionNames: ['schedulePrevWeek', 'scheduleNextWeek'],
  offset     : 0,
  async execute(ctx) {
    this.offset = 0;

    return this.sendSchedule(ctx);
  },
  executeAction: debounce(async function (ctx) {
    const actionName = ctx.update.callback_query.data;

    this.offset += actionName === 'schedulePrevWeek' ? -7 : 7;

    return this.sendSchedule(ctx, true).finally(() => ctx.answerCbQuery());
  }, 500, { leading: true }),
  async sendSchedule(ctx, isEdit = false) {
    const start = getScheduleDate(this.offset);
    const finish = getScheduleDate(this.offset + 7);
    const schedule = await this.getSchedule({ start, finish });

    if (!schedule.error) {
      const title = `Период: ${formatDate(new Date(start))} — ${formatDate(new Date(finish))}`;
      const message = schedule.length ? this.formatSchedule(schedule) : 'Занятий нет. Ликуйте же';
      const fullMessage = `${title}\n\n${message}`;

      if (!isEdit)
        return ctx.replyWithMarkdown(`\`${fullMessage}\``, keyboard);

      return ctx.editMessageText(`\`${fullMessage}\``, { parse_mode: 'Markdown', ...keyboard })
        .catch(() => {});
    }

    await ctx.replyWithMarkdown(`\`Error: ${schedule.error}\``);

    throw schedule.error;
  },
  getSchedule: ({ start, finish }) => request.get(`${config.apiUrl}/getSchedule`, { params: { start, finish } })
    .then((data) => data.schedule)
    .catch((err) => err),
  formatSchedule: memoize((schedule) => {
    const formattedSchedules = map(schedule, (i) => {
      const lesson = [];

      lesson.push(`[${i.dayOfWeekString}] ${i.date} — ${i.disciplineAbbr}`);
      lesson.push(`Тип: ${i.kindOfWork}`);

      if (i.beginLesson !== '18:55')
        lesson.push(`Время: ${i.beginLesson} - ${i.endLesson}`);

      if (i.building !== '-')
        lesson.push(`Кабинет: ${i.auditorium} (${i.building})`);

      if (i.group)
        lesson.push(`Группа: ${i.group}`);

      return lesson.join('\n');
    });

    return formattedSchedules.join('\n\n');
  }),
};
