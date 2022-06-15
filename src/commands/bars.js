import { map, maxBy } from 'lodash';
import textTable from 'text-table';
import request from '../plugins/request';
import config from '../config';
import { formatDate } from '../helpers';

const getMaxMarksItem = (marks) => {
  const maxMarksItem = maxBy(marks, ({ semester, final }) => semester.length + final.length);

  return maxMarksItem.semester.length + maxMarksItem.final.length;
};

export default {
  name       : 'b',
  description: 'Вывод оценок барса',
  async execute(ctx) {
    this.getUser(ctx.userId)
      .then(async (userData) => {
        const userText = `Пользователь: ${userData.username}`;
        const updatedAtText = `Обновлено: ${formatDate(userData.updatedAt, 'HH:mm — DD.MM')}`;
        const statsText = this.getStatsText(ctx, userData);

        await ctx.replyWithMarkdown(`\`${userText}\n${updatedAtText}\n\n${statsText}\``);

        if (!userData.isCredentialsError) {
          const { marks } = userData;

          if (marks && marks.length) {
            const maxMarksCount = getMaxMarksItem(marks);
            const rows = map(marks, ({ discipline, semester, final }) => {
              const marksCount = semester.length + final.length;
              const marksPlugs = Array(maxMarksCount - marksCount).fill(' ');

              return [discipline, ...semester, ...marksPlugs, '|', ...final];
            });

            return ctx.replyWithMarkdown(`\`${textTable(rows)}\``);
          }

          return ctx.replyWithMarkdown('`Данных пока нет`');
        }

        return ctx.replyWithMarkdown('`Ошибка при попытке авторизоваться в барсе. Установите данные еще раз`');
      })
      .catch((err) => {
        ctx.replyWithMarkdown(`\`${err.error}\``);
      });
  },
  getStatsText(ctx, userData) {
    if (!ctx.isAdmin) return '';

    const totalUsersText = `Аккаунтов: ${userData.totalUsers}`;
    const totalErroredUsersText = `Аккаунты с ошибками: ${userData.totalErroredUsers}`;

    return [totalUsersText, totalErroredUsersText].join('\n');
  },
  getUser(userId) {
    return request.get(`${config.apiUrl}/bars/getUser/${userId}`);
  },
};
