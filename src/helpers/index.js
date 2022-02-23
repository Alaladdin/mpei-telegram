import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { filter, map } from 'lodash';

export const formatDate = (date, format = 'DD.MM') => moment(date).format(format);

export const getRandomInt = (min = 0, max = 1) => {
  const minRange = Math.ceil(min);
  const maxRange = Math.floor(max);

  return Math.floor(Math.random() * (maxRange - minRange + 1) + minRange);
};

export const getRandomArrayItem = (arr) => arr[getRandomInt(0, arr.length - 1)];

/* eslint-disable no-param-reassign,global-require,import/no-dynamic-require */
export const getCommandsInfo = () => {
  const commandsFolder = path.resolve(__dirname, '../commands');
  const commandsFolderData = fs.readdirSync(commandsFolder);
  const commandsList = filter(commandsFolderData, (itemName) => itemName !== 'index.js');

  return map(commandsList, (commandPath) => {
    const commandFilePath = path.resolve(__dirname, '../commands', commandPath);

    return require(commandFilePath).default;
  });
};
/* eslint-enable no-param-reassign,global-require,import/no-dynamic-require */
