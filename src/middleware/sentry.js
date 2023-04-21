import '@sentry/tracing';
import * as Sentry from '@sentry/node';
import { keys, each } from 'lodash';
import config from '../config';
import { version } from '../../package.json';

Sentry.init({
  dsn             : config.sentryDsn,
  tracesSampleRate: 1.0,
  release         : version,
  environment     : config.currentEnv,
  enabled         : config.isProd,
  beforeSend      : (e) => {
    delete e.contexts?.os;
    delete e.contexts?.device;

    return e;
  },
  beforeSendTransaction: (e) => {
    delete e.contexts?.os;
    delete e.contexts?.device;

    return e;
  },
});

export default async (ctx, next) => {
  if (config.isProd) {
    const transaction = Sentry.startTransaction({
      op  : ctx.operation,
      name: ctx.operationPayload,
    });

    Sentry.setUser(ctx.from);
    each(keys(ctx), (ctxKey) => {
      Sentry.setContext(ctxKey, ctx[ctxKey]);
    });

    next()
      .catch(Sentry.captureException)
      .finally(() => transaction.finish());
  } else {
    await next();
  }
};
