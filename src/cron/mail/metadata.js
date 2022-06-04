import path from 'path';

export default {
  mailUrl                 : 'https://mail.mpei.ru/owa/',
  unreadLetterLinkSelector: '.cntnt .bld a',
  signInButtonSelector    : '.signinbutton',
  linkPattern             : /(https?:\/\/[^\s]+)/gim,
  fileFolderPath          : path.resolve(__dirname, '../../../tmp'),
  filePath                : path.resolve(__dirname, '../../../tmp/mail.png'),
  stylesPath              : path.resolve(__dirname, './client/styles.css'),
  scriptPath              : path.resolve(__dirname, './client/script.js'),
};
