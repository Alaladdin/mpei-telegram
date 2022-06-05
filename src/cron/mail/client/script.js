/* global document */

const filesIcons = {
  default: 'file',
  doc    : 'file-word',
  docx   : 'file-word',
  pdf    : 'file-pdf',
  xls    : 'file-excel',
  xlsx   : 'file-excel',
  pptx   : 'file-powerpoint',
  jpg    : 'file-image',
  png    : 'file-image',
  zip    : 'file-zipper',
};

const letterTitle = document.querySelector('.sub');
const letterDate = document.querySelector('.hdtxnr'); // need eng version of date
const letterSender = document.querySelector('.rwRRO');
const letterBody = document.querySelector('.bdy');
const letterBodyLinks = [...letterBody.querySelectorAll('a')].map((link) => link.innerText);
const letterAttachments = document.querySelectorAll('#lnkAtmt');
const letterAttachmentsTags = [...letterAttachments].map((attachment, i) => {
  const fileName = attachment.innerText.replace(/\([^(]*\)/, '').trim();
  const fileExtension = fileName.match(/([^.]+)$/gim)[0].replaceAll('\u200E', '');
  const fileIcon = filesIcons[fileExtension] || filesIcons.default;
  const separator = (i !== letterAttachments.length - 1) ? ', ' : '';

  return `
  <span class='letter__attachments-item'>
    <i class="fa-solid fa-${fileIcon}"></i>
    <span class='letter__attachments-title'>${fileName}${separator}</span>
  </span>`;
}).join('');

const removeLineBreaks = (text) => text.replaceAll('\n\n\n', () => '\n\n');
const wrapUrls = (text) => {
  let newText = text;

  letterBodyLinks.forEach((linkTitle) => {
    newText = newText.replaceAll(linkTitle, () => `<a href="https://google.com">${linkTitle}</a>`);
  });

  return newText;
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
      <div class='letter__attachment'>
        <span>Вложения (${letterAttachments.length})${letterAttachments.length ? ':' : ''} </span>
        ${letterAttachmentsTags}
      </div>
    </div>

    ${letterBodyTag}
  </div>
`;
