import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { filter, map, memoize } from 'lodash';

/* eslint-disable no-param-reassign,global-require,import/no-dynamic-require */
export const getFolderModulesInfo = memoize((folderName) => {
  const modulesFolder = path.resolve(__dirname, `../${folderName}`);
  const modulesFolderData = fs.readdirSync(modulesFolder);
  const modulesList = filter(modulesFolderData, (itemName) => itemName !== 'index.js');

  return map(modulesList, (modulePath) => {
    const moduleFilePath = path.resolve(modulesFolder, modulePath);

    return require(moduleFilePath).default;
  });
});
/* eslint-enable no-param-reassign,global-require,import/no-dynamic-require */

export const formatDate = (date, format = 'DD.MM') => moment(date).format(format);
