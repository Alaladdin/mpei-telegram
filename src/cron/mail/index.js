/* global document */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import nodeSchedule from 'node-schedule';
import { each, reject } from 'lodash';
import path from 'path';
import config from '../../config';
import localMetadata from './metadata';

let browser;
let page;

export default {
  async init(bot) {
    nodeSchedule.scheduleJob('0 */1 * * *', async () => {
      this.openBrowser()
        .then(() => this.singIn())
        .then(() => this.checkLetterUnread(bot))
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
  async checkLetterUnread(bot) {
    await page.goto(localMetadata.mailUrl);

    return page.evaluate(() => !!document.querySelector('.cntnt .bld'))
      .then(async (hasUnread) => {
        await (hasUnread ? this.handleUnreadLetter(bot) : this.closeBrowser());

        return hasUnread;
      })
      .then((needToRecheck) => needToRecheck && this.checkLetterUnread(bot));
  },
  async handleUnreadLetter(bot) {
    const letterTitle = await page.$eval('.cntnt .bld a', (titleEl) => titleEl.innerText.trim());
    const isDisallowedLetter = letterTitle.match(/(github|disarmed|spam|ticket)/gi);
    const chatId = isDisallowedLetter ? config.adminChatId : config.mainChatId;

    await this.reCreateFilesFolder();
    await page.click('.cntnt .bld a');
    await page.waitForTimeout(1000);
    await this.handleLetterFiles(bot, chatId);
    await page.addStyleTag({ path: localMetadata.stylesPath });
    await page.addScriptTag({ path: localMetadata.scriptPath });
    await page.waitForTimeout(2000);
    await page.screenshot({ type: 'jpeg', quality: 100, path: localMetadata.filePath });

    return bot.telegram.sendPhoto(
      chatId,
      { source: localMetadata.filePath },
      { caption: `\`${letterTitle}\``, parse_mode: 'Markdown' }
    );
  },
  async handleLetterFiles(bot, chatId) {
    await page._client.send('Page.setDownloadBehavior', {
      behavior    : 'allow',
      downloadPath: localMetadata.filesFolderPath,
    });

    return page
      .$$eval('#lnkAtmt', (attachmentsWrapper) => {
        for (let i = 0; i < attachmentsWrapper.length; i += 1)
          setTimeout(() => attachmentsWrapper[i].click(), 100 * i);

        return attachmentsWrapper.length;
      })
      .then((attachmentsCount) => page.waitForTimeout(attachmentsCount * 200))
      .then(async () => {
        const filesFolder = await fs.readdir(localMetadata.filesFolderPath);
        const letterFiles = reject(filesFolder, (file) => file === 'letter.png');

        each(letterFiles, (file) => {
          const filePath = path.resolve(__dirname, '../../../tmp', file);

          bot.telegram.sendDocument(chatId, { source: filePath });
        });
      });
  },
  async reCreateFilesFolder() {
    return fs.rm(localMetadata.filesFolderPath, { recursive: true })
      .catch(() => {})
      .then(() => fs.mkdir(localMetadata.filesFolderPath));
  },
  sendMessage(bot, chatId, message) {
    return bot.telegram.sendMessage(chatId, `\`${message}\``, { parse_mode: 'Markdown' });
  },
  closeBrowser() {
    return browser.close();
  },
};
