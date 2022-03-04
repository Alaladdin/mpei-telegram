import nodeSchedule from 'node-schedule';
import scheduleCommand from '../commands/schedule';

export default {
  init(bot) {
    nodeSchedule.scheduleJob('0 0 9 * * *', async () => {
      const scheduleInfo = scheduleCommand.getScheduleInfo();
      const rawSchedule = await scheduleCommand.getSchedule(scheduleInfo);

      if (rawSchedule && rawSchedule.length) {
        const formattedSchedule = scheduleCommand.formatSchedule(rawSchedule);
        const message = `\`${scheduleInfo.title}\n\n${formattedSchedule}\``;

        await bot.telegram.sendMessage('398532631', message, { parse_mode: 'Markdown' });
      }
    });
  },
};
