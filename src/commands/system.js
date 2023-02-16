import si from 'systeminformation';
import moment from 'moment';

export default {
  name       : 'system_info',
  description: 'Информация по машине',
  async execute(ctx) {
    ctx.sendChatAction('typing');

    const osInfo = await si.osInfo();
    const memoryInfo = await si.mem();
    const systemInfo = await si.system();
    const timeInfo = await si.time();

    const memoryUsage = (memoryInfo.used / (memoryInfo.total / 100)).toFixed(2);

    const message = [
      'System Info\n',
      `OS: ${osInfo.platform} - ${osInfo.distro}`,
      `Memory usage: ${memoryUsage}%`,
      `Virtual: ${systemInfo.virtual}`,
      `Timezone: ${timeInfo.timezoneName}`,
      `Current time: ${moment(timeInfo.current).format('HH:mm:ss')}`,
    ];

    await ctx.replyWithMarkdown(`\`${message.join('\n')}\``);
  },
};
