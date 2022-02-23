import axios from 'axios';
import { map } from 'lodash';
import { apiRequestsMap } from '../../data';
import metadata from './metadata';

export default {
  name       : 's',
  description: 'Расписание',
  arguments  : [
    { name: 'week', description: 'на неделю' },
    { name: 'month', description: 'на месяц' },
  ],
  async execute(ctx, args) {
    const scheduleInfo = this.getScheduleInfo(args[0]);
    const schedule = await this.getSchedule(scheduleInfo.start, scheduleInfo.finish);

    if (!schedule)
      return ctx.replyWithMarkdown('`Шо та пошло не так`');

    if (schedule.length) {
      const formattedSchedule = this.getFormattedSchedule(schedule);
      const message = [scheduleInfo.title, formattedSchedule].join('\n\n');

      return ctx.replyWithMarkdown(`\`${message}\``);
    }

    return ctx.replyWithMarkdown('`Занятий нет. Ликуйте же`');
  },
  getScheduleInfo(schedulePeriod) {
    const { scheduleInfo } = metadata;

    return scheduleInfo[schedulePeriod] || scheduleInfo.default;
  },
  getSchedule: (start, finish) => axios.get(apiRequestsMap.getSchedule, { params: { start, finish } })
    .then((res) => res.data.schedule)
    .catch((err) => {
      console.error(err);

      throw err;
    }),
  getFormattedSchedule: (schedule) => {
    const formattedSchedules = map(schedule, (i) => {
      const lesson = [];

      lesson.push(`[${i.dayOfWeekString}] ${i.date} — ${i.disciplineAbbr}`);
      lesson.push(`Тип: ${i.kindOfWork}`);

      if (i.beginLesson !== '18:55')
        lesson.push(`Время: ${i.beginLesson} -  ${i.endLesson}`);

      if (i.building !== '-')
        lesson.push(`Кабинет: ${i.auditorium} (${i.building})`);

      if (i.group)
        lesson.push(`Группа: ${i.group}`);

      return lesson.join('\n');
    });

    return formattedSchedules.join('\n\n');
  },
};
