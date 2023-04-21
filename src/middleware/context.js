export default async (ctx) => {
  let operationPayload = null;

  if (ctx.updateType === 'message')
    operationPayload = ctx.message.text;

  if (ctx.updateType === 'callback_query')
    operationPayload = ctx.callbackQuery.data;

  ctx.operation = ctx.updateType;
  ctx.operationPayload = operationPayload;
};
