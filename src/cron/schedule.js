import nodeSchedule from 'node-schedule';
import moment from 'moment';
import scheduleCommand from '../commands/schedule';
import config from '../config';

export default {
  async init(bot) {
    nodeSchedule.scheduleJob('0 0 9 * * *', async () => {
      const today = moment().format(config.serverDateFormat);
      const rawSchedule = await scheduleCommand.getSchedule({ start: today, finish: today });

      if (rawSchedule && rawSchedule.length) {
        const formattedSchedule = scheduleCommand.formatSchedule(rawSchedule);
        const message = ['Расписание на сегодня', formattedSchedule].join('\n\n');

        await bot.telegram.sendMessage(config.mainChat, `\`${message}\``, { parse_mode: 'Markdown' });
      }
    });
  },
};
