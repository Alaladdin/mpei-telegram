import '@sentry/tracing';
import * as Sentry from '@sentry/node';
import config from '../config';

Sentry.init({
  dsn             : config.sentryDsn,
  tracesSampleRate: 1.0,
  environment     : config.currentEnv,
  enabled         : config.isProd,
});

export default async (ctx, next) => {
  if (config.isProd) {
    const transaction = Sentry.startTransaction({
      op  : ctx.operation,
      name: ctx.operationPayload,
    });

    Sentry.setUser({
      username     : ctx.username,
      chatId       : ctx.chatId,
      userId       : ctx.userId,
      isAdmin      : ctx.isAdmin,
      isPrivateChat: ctx.isPrivateChat,
    });

    next()
      .catch(Sentry.captureException)
      .finally(() => transaction.finish());
  } else {
    await next();
  }
};
