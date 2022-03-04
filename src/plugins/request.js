import axios from 'axios';
import merge from 'lodash/merge';
import config from '../../config';

const baseHeaders = { authToken: config.authToken };
const handleError = (err) => {
  const { response } = err;
  const errorData = (response && response.data) || { error: err.code };

  console.error(errorData.error);

  throw errorData;
};

export default {
  get: (url, options) => axios.get(url, merge({ headers: baseHeaders }, options))
    .then((res) => res.data)
    .catch(handleError),

  post: (url, data) => axios.post(url, data, { headers: baseHeaders })
    .then((res) => res.data)
    .catch(handleError),
};
