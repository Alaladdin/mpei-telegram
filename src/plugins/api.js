import axios from 'axios';
import { reportCrash } from '../helpers';
import config from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
});

const handleError = (err) => {
  const { response: res, code: errorCode } = err;
  const errorData = (res && res.data) || { error: errorCode };

  reportCrash(errorData.error);

  throw errorData;
};

export default {
  get: (url, options) => api.get(url, options)
    .then((res) => res.data)
    .catch(handleError),
};
