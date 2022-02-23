import config from '../../config';

export const phrases = {
  greetings: ['`Не придумал сюда текст`'],
};

export const apiRequestsMap = {
  getActuality: `${config.apiUrl}/getActuality`,
  getSchedule : `${config.apiUrl}/getSchedule`,
};
