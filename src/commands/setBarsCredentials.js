export default {
  name       : 'set_bars_credentials',
  description: 'Установка данных барса',
  execute    : (ctx) => {
    if (ctx.isPrivateChat)
      return ctx.scene.enter('SET_BARS_CREDENTIALS');

    return ctx.replyWithMarkdown('`Команда работает только в личных сообщениях`');
  },
};
