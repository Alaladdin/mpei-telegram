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
      this.openBrowser()
        .then(() => this.singIn())
        .then(() => this.checkUnread(bot))
        .catch((error) => {
          const errorMessage = `[PARSER ERROR]: ${error}`;

          this.sendMessage(bot, config.adminChatId, errorMessage);

          console.error(errorMessage);
          this.closeBrowser();
        });
    });
  },
  async openBrowser() {
    browser = await puppeteer.launch({
      args           : ['--no-sandbox', `--window-size=${1080},${720}`],
      headless       : config.isProd,
      defaultViewport: {
        width : 1080,
        height: 720,
      },
    });
    page = await browser.newPage();

    return true;
  },
  singIn() {
    return page
      .goto(localMetadata.mailUrl)
      .then(() => this.enterAuthData());
  },
  async enterAuthData() {
    await page.type('#username', config.mailUsername);
    await page.type('#password', config.mailPassword);
    await page.click('.signinbutton');
    await page.waitForTimeout(2000);

    return page.evaluate(() => !!document.querySelector('#lo'))
      .then((isLoggedIn) => !isLoggedIn && this.enterAuthData());
  },
  async checkUnread(bot) {
    await page.goto(localMetadata.mailUrl);

    return page.evaluate(() => !!document.querySelector('.cntnt .bld'))
      .then(async (hasUnread) => {
        await (hasUnread ? this.handleUnread(bot) : this.closeBrowser());

        return hasUnread;
      })
      .then((needToRecheck) => needToRecheck && this.checkUnread(bot));
  },
  async handleUnread(bot) {
    const letterTitle = await page.$eval('.cntnt .bld a', (titleEl) => titleEl.innerText.trim());
    const isDisallowedLetter = letterTitle.match(/(github|disarmed|spam|ticket)/gi);
    const chatId = isDisallowedLetter ? config.adminChatId : config.mainChatId;

    await page.click('.cntnt .bld a');
    await page.waitForTimeout(1000);
    await page.addStyleTag({ path: localMetadata.stylesPath });
    await page.addScriptTag({ path: localMetadata.scriptPath });
    await page.waitForTimeout(1500);
    await page.screenshot({ type: 'jpeg', quality: 100, path: localMetadata.filePath });

    return bot.telegram.sendPhoto(
      chatId,
      { source: localMetadata.filePath },
      { caption: `\`${letterTitle}\``, parse_mode: 'Markdown' }
    );
  },
  sendMessage(bot, chatId, message) {
    return bot.telegram.sendMessage(chatId, `\`${message}\``, { parse_mode: 'Markdown' });
  },
  closeBrowser() {
    return browser.close();
  },
};
