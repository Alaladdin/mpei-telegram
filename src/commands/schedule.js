import { map, memoize } from 'lodash';
import { Markup } from 'telegraf';
import moment from 'moment';
import { formatDate } from '../helpers';
import api from '../plugins/api';
import config from '../config';

export default {
  name       : 's',
  description: 'Расписание',
  actionNames: [
    'schedulePrevWeek',
    'scheduleCurrentWeek',
    'scheduleNextWeek',
    'scheduleToggleFieldsVisibility',
  ],
  offset              : 0,
  showAdditionalFields: false,
  async execute(ctx) {
    this.offset = 0;
    this.showAdditionalFields = false;

    return this.sendSchedule(ctx)
      .catch((err) => {
        ctx.replyWithMarkdown(`\`Error: ${err}\``);
      });
  },
  async executeAction(ctx) {
    const actionName = ctx.update.callback_query.data;

    if (actionName === 'scheduleToggleFieldsVisibility')
      this.showAdditionalFields = !this.showAdditionalFields;

    if (actionName === 'scheduleCurrentWeek')
      this.offset = 0;

    if (actionName === 'schedulePrevWeek')
      this.offset -= 1;

    if (actionName === 'scheduleNextWeek')
      this.offset += 1;

    return this.sendSchedule(ctx, true)
      .catch((err) => {
        ctx.replyWithMarkdown(`\`Error: ${err}\``);
      })
      .finally(() => ctx.answerCbQuery());
  },
  async sendSchedule(ctx, isEdit = false) {
    const start = this.getScheduleDate(true);
    const finish = this.getScheduleDate(false);
    const schedule = await this.getSchedule({ start, finish });

    if (!schedule.error) {
      const title = `Период: ${formatDate(new Date(start))} — ${formatDate(new Date(finish))}`;
      const formatOptions = { showAdditionalFields: this.showAdditionalFields, markTodayLesson: true };
      const message = schedule.length ? this.formatSchedule(schedule, formatOptions) : 'Занятий нет. Ликуйте же';
      const fullMessage = `*${title}*\n\n\`${message}\``;
      const keyboard = this.getKeyboard();

      if (!isEdit)
        return ctx.replyWithMarkdown(fullMessage, keyboard);

      return ctx.editMessageText(fullMessage, { parse_mode: 'Markdown', ...keyboard })
        .catch(() => {});
    }

    throw schedule;
  },
  getScheduleDate(isStart) {
    const rawDate = moment().add(2, 'days').add(this.offset, 'weeks');
    const date = isStart ? rawDate.startOf('isoWeek') : rawDate.endOf('isoWeek');

    return date.format(config.serverDateFormat);
  },
  getSchedule: ({ start, finish }) => api.get(`${config.apiUrl}/getSchedule`, { params: { start, finish } })
    .then((data) => data.schedule),
  formatSchedule: memoize((schedule, options = {}) => {
    const formattedSchedules = map(schedule, (i) => {
      const today = moment().format('DD.MM');

      const lesson = [];

      lesson.push(`[${i.dayOfWeekString}] ${i.date} — ${i.disciplineAbbr}`);

      if (options.showAdditionalFields)
        lesson.push(`Предмет: ${i.discipline}`);

      lesson.push(`Тип: ${i.kindOfWork}`);

      if (options.showAdditionalFields || i.beginLesson !== '18:55')
        lesson.push(`Время: ${i.beginLesson} - ${i.endLesson}`);

      if (i.building !== '-')
        lesson.push(`Кабинет: ${i.auditorium} (${i.building})`);

      if (options.showAdditionalFields)
        lesson.push(`Препод: ${i.lecturer}`);

      if (i.group)
        lesson.push(`Группа: ${i.group}`);

      if (options.markTodayLesson && today === i.date)
        return map(lesson, (desc) => `* ${desc}`).join('\n');

      return lesson.join('\n');
    });

    return formattedSchedules.join('\n\n');
  }),
  getKeyboard() {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('сюдым', 'schedulePrevWeek'),
        Markup.button.callback('текущая', 'scheduleCurrentWeek'),
        Markup.button.callback('тудым', 'scheduleNextWeek'),
      ],
      [
        Markup.button.callback(
          this.showAdditionalFields ? 'менее подробно' : 'подробнее',
          'scheduleToggleFieldsVisibility'
        ),
      ],
    ]);
  },
};
