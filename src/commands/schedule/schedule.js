import { map, memoize } from 'lodash';
import metadata from './metadata';
import request from '../../plugins/request';
import config from '../../../config';

export default {
  name       : 's',
  description: 'Расписание',
  arguments  : [
    { name: 'week', description: 'на неделю' },
    { name: 'month', description: 'на месяц' },
  ],
  async execute(ctx, args) {
    const scheduleInfo = this.getScheduleInfo(args[0]);
    const schedule = await this.getSchedule(scheduleInfo);

    if (schedule.error)
      return ctx.replyWithMarkdown(`\`Error: ${schedule.error}\``);

    if (schedule.length) {
      const formattedSchedule = this.formatSchedule(schedule);
      const message = [scheduleInfo.title, formattedSchedule].join('\n\n');

      return ctx.replyWithMarkdown(`\`${message}\``);
    }

    return ctx.replyWithMarkdown('`Занятий нет. Ликуйте же`');
  },
  getScheduleInfo(schedulePeriod) {
    const { scheduleInfo } = metadata;
    const selectedSchedule = scheduleInfo[schedulePeriod] || scheduleInfo.default;

    return {
      title : selectedSchedule.title,
      start : selectedSchedule.getStartDate(),
      finish: selectedSchedule.getFinishDate(),
    };
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
