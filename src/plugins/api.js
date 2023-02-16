import axios from 'axios';
import { reportCrash } from '../helpers';
import config from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
});

const handleError = (err) => {
  const { response: res } = err;
  const errorMessage = res?.data?.error || err?.message || err;

  reportCrash(err);

  throw errorMessage;
};

export default {
  get: (url, options) => api.get(url, options)
    .then((res) => res.data)
    .catch(handleError),
};
