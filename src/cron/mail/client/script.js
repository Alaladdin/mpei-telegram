/* global document */

const mailTitle = document.querySelector('.sub');
const mailSender = document.querySelector('.rwRRO');
const mailBody = document.querySelector('.bdy');
const mailAttachments = document.querySelectorAll('#spnAtmt');

const removeLineBreaks = (text) => text.replace('\n\n', () => '\n');
const wrapUrls = (text) => {
  const urlPattern = /(https?:\/\/[^\s]+)/gim;

  return text.replace(urlPattern, (url) => `<a href="${url}">${url}</a>`);
};

const mailBodyText = wrapUrls(removeLineBreaks(mailBody.innerText.trim()));
const mailBodyTag = mailBodyText ? `<div class='mail__body'>${mailBodyText}</div>` : '';

document.body.innerHTML = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"  />
  <header class='header'>WINX MAGIC SYSTEM</header>
  <div class='wrapper'>
    <div class='mail__title'>${mailTitle.innerText}</div>
    <div class='mail__sender'>Отправитель: ${mailSender.innerHTML}</div>
    <div class='mail__attachments'>
      <span>Вложений:</span>
      <i class="fa-solid fa-file"></i> ${mailAttachments.length}
    </div>
    ${mailBodyTag}
  </div>
`;
