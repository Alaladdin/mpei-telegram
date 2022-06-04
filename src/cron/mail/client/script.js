/* global document */

const letterTitle = document.querySelector('.sub');
const letterDate = document.querySelector('.hdtxnr');
const letterSender = document.querySelector('.rwRRO');
const letterBody = document.querySelector('.bdy');
const letterAttachments = document.querySelectorAll('#spnAtmt');

const removeLineBreaks = (text) => text.replace('\n\n', () => '\n');
const wrapUrls = (text) => {
  const linkPattern = /(https?:\/\/[^\s]+)/gim;

  return text.replace(linkPattern, (url) => `<a href="${url}">${url}</a>`);
};

const letterBodyText = wrapUrls(removeLineBreaks(letterBody.innerText.trim()));
const letterBodyTag = letterBodyText ? `<div class='letter__body'>${letterBodyText}</div>` : '';
const letterFormattedDate = new Date(letterDate.innerText).toLocaleString();

document.body.innerHTML = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"  />
  <header class='header'>WINX MAGIC SYSTEM</header>
  <div class='letter'>
    <div class='letter__title'>${letterTitle.innerText}</div>

    <div class='letter__meta'>
      <div class='letter__date'>Получено: ${letterFormattedDate}</div>
      <div class='letter__sender'>Отправитель: ${letterSender.innerHTML}</div>
      <div class='letter__attachments'>
        <span>Вложений:</span>
        <i class="fa-solid fa-file"></i> ${letterAttachments.length}
      </div>
    </div>

    ${letterBodyTag}
  </div>
`;
