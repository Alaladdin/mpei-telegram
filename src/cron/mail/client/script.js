/* global document */

const mailTitle = document.querySelector('.sub');
const mailDate = document.querySelector('.hdtxnr');
const mailSender = document.querySelector('.rwRRO');
const mailBody = document.querySelector('.bdy');
const mailAttachments = document.querySelectorAll('#spnAtmt');

const removeLineBreaks = (text) => text.replace('\n\n', () => '\n');
const wrapUrls = (text) => {
  const linkPattern = /(https?:\/\/[^\s]+)/gim;

  return text.replace(linkPattern, (url) => `<a href="${url}">${url}</a>`);
};

const mailBodyText = wrapUrls(removeLineBreaks(mailBody.innerText.trim()));
const mailBodyTag = mailBodyText ? `<div class='mail__body'>${mailBodyText}</div>` : '';
const mailFormattedDate = new Date(mailDate.innerText).toLocaleString();

document.body.innerHTML = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"  />
  <header class='header'>WINX MAGIC SYSTEM</header>
  <div class='wrapper'>
    <div class='mail__title'>${mailTitle.innerText}</div>

    <div class='mail__meta'>
      <div class='mail__date'>Получено: ${mailFormattedDate}</div>
      <div class='mail__sender'>Отправитель: ${mailSender.innerHTML}</div>
      <div class='mail__attachments'>
        <span>Вложений:</span>
        <i class="fa-solid fa-file"></i> ${mailAttachments.length}
      </div>
    </div>

    ${mailBodyTag}
  </div>
`;
