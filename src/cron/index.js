import schedule from './schedule';
import mail from './mail';

export default {
  init(bot) {
    schedule.init(bot);
    mail.init(bot);
  },
};
