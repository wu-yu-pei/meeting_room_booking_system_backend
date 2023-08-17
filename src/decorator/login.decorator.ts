import { SetMetadata } from '@nestjs/common';

export const Login = (isNeedLogin: boolean) =>
  SetMetadata('require-login', isNeedLogin);
