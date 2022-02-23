require('dotenv').config();

module.exports = {
  apps: [
    {
      name          : 'mtg',
      script        : 'app.js',
      node_args     : '-r esm',
      wait_ready    : false,
      watch         : true,
      restart_delay : 5000,
      ignore_watch  : ['node_modules'],
      env           : { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
  deploy: {
    // "production" is the environment name
    production: {
      key          : process.env.DEPLOY_KEY,
      user         : process.env.DEPLOY_USER,
      host         : [{ host: process.env.DEPLOY_HOST, port: process.env.DEPLOY_PORT }],
      ref          : 'origin/main',
      repo         : 'https://github.com/Alaladdin/mpei-telegram',
      path         : process.env.DEPLOY_PATH,
      'pre-deploy' : 'pm2 stop ./ecosystem.config.js',
      'post-deploy': 'pnpm install; pm2 start ./ecosystem.config.js --env production --update-env',
    },
  },
};
