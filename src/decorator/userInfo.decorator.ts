import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user[data];
  },
);
