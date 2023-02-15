import axios from 'axios';
import { reportCrash } from '../helpers';

const handleError = (err) => {
  const { response: res, code: errorCode } = err;
  const errorData = (res && res.data) || { error: errorCode };

  reportCrash(errorData.error);

  throw errorData;
};

export default {
  get: (url, options) => axios.get(url, options)
    .then((res) => res.data)
    .catch(handleError),
};
