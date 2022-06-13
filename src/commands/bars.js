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
    this.getMarks(ctx.userId)
      .then(async (marksData) => {
        const { username, marks, updatedAt, isCredentialsError } = marksData;
        const userText = `Пользователь: ${username}`;
        const updatedAtText = `Обновлено: ${formatDate(updatedAt, 'HH:mm — DD.MM')}`;

        await ctx.replyWithMarkdown(`\`${userText}\n${updatedAtText}\``);

        if (!isCredentialsError) {
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
  getMarks(userId) {
    return request.get(`${config.apiUrl}/bars/getMarks/${userId}`);
  },
};
