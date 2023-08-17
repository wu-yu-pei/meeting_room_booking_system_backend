import { Controller, Get } from '@nestjs/common';
import { Login } from './decorator/login.decorator';

import { AppService } from './app.service';
import { Permission } from './decorator/permission.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @Login(true)
  @Permission(['aaa'])
  getAaa(): string {
    return 'a';
  }

  @Get('bbb')
  @Login(true)
  @Permission(['bbb'])
  getBbb(): string {
    return 'b';
  }
}
