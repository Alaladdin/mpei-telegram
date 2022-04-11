import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { filter, map, memoize } from 'lodash';

/* eslint-disable no-param-reassign,global-require,import/no-dynamic-require */
export const getCommandsInfo = memoize(() => {
  const commandsFolder = path.resolve(__dirname, '../commands');
  const commandsFolderData = fs.readdirSync(commandsFolder);
  const commandsList = filter(commandsFolderData, (itemName) => itemName !== 'index.js');

  return map(commandsList, (commandPath) => {
    const commandFilePath = path.resolve(commandsFolder, commandPath);

    return require(commandFilePath).default;
  });
});
/* eslint-enable no-param-reassign,global-require,import/no-dynamic-require */

export const formatDate = (date, format = 'DD.MM') => moment(date).format(format);
export const getScheduleDate = (addDays = 0) => moment().add(addDays, 'days').format('YYYY.MM.DD');
