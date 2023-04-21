export default {
  name       : 'start',
  description: 'Инициализация бота',
  hidden     : true,
  async execute(ctx) {
    const user = ctx.from;
    const fullName = [user.first_name, user.last_name].join(' ');

    await ctx.replyWithMarkdown(`\`Приветствую, ${fullName}\``);
  },
};
