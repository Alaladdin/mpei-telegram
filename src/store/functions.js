import EventEmitter from 'events';
import request from '../plugins/request';
import config from '../config';

export const loadRemoteStore = () => request
  .get(`${config.apiUrl}/tg/getStore`)
  .then((data) => data.store)
  .catch((errorData) => {
    console.error(errorData.error);

    return errorData.store;
  });

export const setRemoteStore = (store) => request
  .post(`${config.apiUrl}/tg/setStore`, { store })
  .then((data) => data.store)
  .catch((errorData) => {
    console.error(errorData.error);

    return errorData.store;
  });

export const storeEventEmitter = new EventEmitter();
