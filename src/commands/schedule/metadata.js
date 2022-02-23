import moment from 'moment';

const getScheduleDate = (addDays = 0) => moment().add(addDays, 'days').format('YYYY.MM.DD');

export default {
  scheduleInfo: {
    week: {
      title : 'Расписание на неделю',
      start : getScheduleDate(),
      finish: getScheduleDate(7),
    },
    month: {
      title : 'Расписание на месяц',
      start : getScheduleDate(),
      finish: getScheduleDate(30),
    },
    default: {
      title : 'Расписание на сегодня',
      start : getScheduleDate(),
      finish: getScheduleDate(),
    },
  },
};
