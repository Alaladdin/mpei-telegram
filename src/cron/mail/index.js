/* global document */

import puppeteer from 'puppeteer';
import fs from 'fs';
import nodeSchedule from 'node-schedule';
import config from '../../config';
import localMetadata from './metadata';

let browser;
let page;

export default {
  async init(bot) {
    if (!fs.existsSync(localMetadata.fileFolderPath))
      fs.mkdirSync(localMetadata.fileFolderPath);

    nodeSchedule.scheduleJob('0 */1 * * *', async () => {
      console.info('mail parser schedule');

      browser = await puppeteer.launch({
        args           : ['--no-sandbox', `--window-size=${1080},${720}`],
        headless       : config.isProd,
        defaultViewport: {
          width : 1080,
          height: 720,
        },
      });
      page = await browser.newPage();

      this.singIn()
        .then(() => this.checkUnread(bot))
        .catch((error) => {
          const errorMessage = `[PARSER ERROR]: ${error}`;

          bot.telegram.sendMessage(config.adminChatId, `\`${errorMessage}\``, { parse_mode: 'Markdown' });
          console.error(errorMessage);
          this.closeBrowser();
        });
    });
  },
  singIn() {
    console.info('singIn');

    return page
      .goto(localMetadata.mailUrl)
      .then(() => this.enterAuthData());
  },
  async enterAuthData() {
    console.info('enterAuthData');

    await page.type('#username', config.mailUsername);
    await page.type('#password', config.mailPassword);
    await page.click(localMetadata.signInButtonSelector);
    await page.waitForTimeout(2000);

    return page.evaluate(() => !!document.querySelector('#lo'))
      .then((isLoggedIn) => !isLoggedIn && this.enterAuthData());
  },
  async checkUnread(bot) {
    console.info('checkUnread');

    await page.goto(localMetadata.mailUrl);

    return page.evaluate(() => !!document.querySelector('.cntnt .bld'))
      .then(async (hasUnread) => {
        await (hasUnread ? this.handleUnread(bot) : this.closeBrowser());

        return hasUnread;
      })
      .then((needToRecheck) => {
        if (needToRecheck)
          this.checkUnread(bot);
      });
  },
  async handleUnread(bot) {
    console.info('handleUnread');

    await page.click(localMetadata.unreadLetterLinkSelector);
    await page.waitForTimeout(1000);
    await page.addStyleTag({ path: localMetadata.stylesPath });
    await page.addScriptTag({ path: localMetadata.scriptPath });
    await page.waitForTimeout(1500);
    await page.screenshot({ type: 'jpeg', quality: 100, path: localMetadata.filePath });

    return bot.telegram.sendPhoto(config.mainChatId, { source: localMetadata.filePath });
  },
  closeBrowser() {
    console.info('closeBrowser');

    return browser.close();
  },
};
