import { map } from 'lodash';
import textTable from 'text-table';
import request from '../plugins/request';
import config from '../config';
import { formatDate } from '../helpers';

export default {
  name       : 'get_bars_marks',
  description: 'Вывод оценок барса',
  async execute(ctx) {
    this.getMarks(ctx)
      .then(async (marksData) => {
        const { username, marks, updatedAt, isCredentialsError } = marksData;
        const userText = `Пользователь: ${username}`;
        const updatedAtText = `Обновлено: ${formatDate(updatedAt, 'HH:mm — DD.MM')}`;

        await ctx.replyWithMarkdown(`\`${userText}\n${updatedAtText}\``);

        if (!isCredentialsError) {
          if (marks && marks.length) {
            const rows = map(marks, (mark) => ([mark.discipline, ...mark.marks]));

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
  getMarks(ctx) {
    return request.get(`${config.apiUrl}/bars/getMarks/${ctx.userId}`);
  },
};
