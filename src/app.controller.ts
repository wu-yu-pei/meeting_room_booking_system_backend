import { Controller, Get } from '@nestjs/common';
import { Login } from './decorator/login.decorator';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @Login(true)
  getAaa(): string {
    return 'a';
  }

  @Get('bbb')
  @Login(false)
  getBbb(): string {
    return 'b';
  }
}
