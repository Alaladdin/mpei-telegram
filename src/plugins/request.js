import axios from 'axios';
import merge from 'lodash/merge';
import config from '../config';

const baseHeaders = { authToken: config.authToken };
const handleError = (err) => {
  const { response: res, code: errorCode } = err;
  const errorData = (res && res.data) || { error: errorCode };

  console.error(errorData.error);

  throw errorData;
};

export default {
  get: (url, options) => axios.get(url, merge({ headers: baseHeaders }, options))
    .then((res) => res.data)
    .catch(handleError),
};
