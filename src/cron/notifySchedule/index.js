import nodeSchedule from 'node-schedule';
import moment from 'moment';
import { find, each } from 'lodash';
import scheduleCommand from '../../commands/schedule';
import { getScheduleDate } from '../../commands/schedule/metadata';
import { getDateDiff } from '../../helpers';
import metadata from './metadata';

export default {
  currentScheduleJob: null,
  async init(bot) {
    await this.createTodaySchedule(bot);

    nodeSchedule.scheduleJob('0 30 8 * * *', () => this.createTodaySchedule(bot));
  },
  async createTodaySchedule(bot) {
    const scheduleSubscribers = store.get('scheduleSubscribers') || [];

    if (scheduleSubscribers.length) {
      const scheduleInfo = scheduleCommand.getScheduleInfo();
      const rawSchedule = await scheduleCommand.getSchedule(scheduleInfo);

      if (rawSchedule && rawSchedule.length) {
        const { diffMinutes, lessonDate, notifyBeforeLessonInMinutes } = this.getScheduleAdditionalData(rawSchedule[0]);

        nodeSchedule.cancelJob(this.currentScheduleJob);

        if (diffMinutes >= 0 && diffMinutes <= notifyBeforeLessonInMinutes)
          await this.sendSchedule(bot);
        else
          this.currentScheduleJob = nodeSchedule.scheduleJob(lessonDate, () => this.sendSchedule(bot));
      }
    }
  },
  getScheduleAdditionalData(schedule) {
    const notifyBeforeLessonInMinutes = this.getNotificationSubtractMinutes(schedule);
    const todayDate = getScheduleDate();
    const lessonDate = new Date(`${todayDate} ${schedule.beginLesson}`);
    const lessonDateWithOffset = moment(lessonDate).subtract(notifyBeforeLessonInMinutes, 'minutes');
    const diffDate = getDateDiff(moment(), lessonDateWithOffset);

    return {
      diffMinutes: diffDate.asMinutes(),
      lessonDate : lessonDateWithOffset,
      notifyBeforeLessonInMinutes,
    };
  },
  getNotificationSubtractMinutes(schedule) {
    const notificationRuleData = find(metadata.notificationRules, { kindOfWorkOid: schedule.kindOfWorkOid });

    return notificationRuleData.subtractMinutes || 30;
  },
  async sendSchedule(bot) {
    const scheduleSubscribers = store.get('scheduleSubscribers') || [];
    const scheduleInfo = scheduleCommand.getScheduleInfo();
    const rawSchedule = await scheduleCommand.getSchedule(scheduleInfo);

    return each(scheduleSubscribers, async (chatId) => {
      const formattedSchedule = scheduleCommand.formatSchedule(rawSchedule);
      const message = `\`${scheduleInfo.title}\n\n${formattedSchedule}\``;

      await bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    });
  },
};
