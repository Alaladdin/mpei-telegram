import moment from 'moment';

const getScheduleDate = (addDays = 0) => moment().add(addDays, 'days').format('YYYY.MM.DD');

export default {
  scheduleInfo: {
    week: {
      title        : 'Расписание на неделю',
      getStartDate : () => getScheduleDate(),
      getFinishDate: () => getScheduleDate(7),
    },
    month: {
      title        : 'Расписание на месяц',
      getStartDate : () => getScheduleDate(),
      getFinishDate: () => getScheduleDate(30),
    },
    default: {
      title        : 'Расписание на сегодня',
      getStartDate : () => getScheduleDate(),
      getFinishDate: () => getScheduleDate(),
    },
  },
};
