import { SetMetadata } from '@nestjs/common';

export const Auth = (isNeedLogin = true) =>
  SetMetadata('require-login', isNeedLogin);
