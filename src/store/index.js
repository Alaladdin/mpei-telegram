import { each, keys, debounce } from 'lodash';
import { loadRemoteStore, setRemoteStore, storeEventEmitter } from './functions';
import CreateStore from './createStore';

global.store = new CreateStore();

export const initStore = async () => loadRemoteStore()
  .then((remoteStore) => {
    const remoteStoreKeys = keys(remoteStore);

    each(remoteStoreKeys, (key) => {
      store.set(key, remoteStore[key], { suppressEvent: true });
    });

    return remoteStore;
  });

const updateRemoteStore = debounce(() => {
  const currentState = store.getState();

  setRemoteStore(currentState)
    .catch(console.error);
}, 2000);

storeEventEmitter.on('store-updated', updateRemoteStore);
