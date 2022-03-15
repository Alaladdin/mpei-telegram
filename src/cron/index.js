import schedule from './schedule';
import notifySchedule from './notifySchedule';

export default {
  init(bot) {
    schedule.init(bot);
    notifySchedule.init(bot);
  },
};
