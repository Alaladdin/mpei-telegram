import Nightmare from 'nightmare';
import fs from 'fs';
import nodeSchedule from 'node-schedule';
import config from '../../config';
import localMetadata from './metadata';

let nightmare;

export default {
  init(bot) {
    if (!fs.existsSync(localMetadata.fileFolderPath))
      fs.mkdirSync(localMetadata.fileFolderPath);

    nodeSchedule.scheduleJob('0 */1 * * *', () => {
      nightmare = Nightmare({ width: 1080, height: 720, show: !config.isProd });

      this.singIn()
        .then(() => this.checkUnread(bot))
        .catch((error) => {
          const errorMessage = `[PARSER ERROR]: ${error}`;

          bot.telegram.sendMessage(config.adminChatId, `\`${errorMessage}\``, { parse_mode: 'Markdown' });
          console.error(errorMessage);
          this.endProcess();
        });
    });
  },
  singIn() {
    return nightmare
      .goto(localMetadata.mailUrl)
      .then(() => this.enterAuthData());
  },
  enterAuthData() {
    return nightmare
      .insert('#username', config.mailUsername)
      .insert('#password', config.mailPassword)
      .click(localMetadata.signInButtonSelector)
      .wait(1000)
      .exists(localMetadata.isLoggedSelector)
      .then((isLoggedIn) => !isLoggedIn && this.enterAuthData());
  },
  checkUnread(bot) {
    return nightmare
      .goto(localMetadata.mailUrl)
      .exists(localMetadata.unreadLetterSelector)
      .then((hasUnread) => (hasUnread ? this.handleUnread(bot) : this.endProcess()))
      .then(() => this.checkUnread(bot));
  },
  handleUnread(bot) {
    return nightmare
      .click(localMetadata.unreadLetterLinkSelector)
      .inject('css', localMetadata.stylesPath)
      .inject('js', localMetadata.scriptPath)
      .wait(1500)
      .screenshot(localMetadata.filePath)
      .then(() => bot.telegram.sendPhoto(config.mainChatId, { source: localMetadata.filePath }));
  },
  endProcess() {
    return nightmare.end();
  },
};
