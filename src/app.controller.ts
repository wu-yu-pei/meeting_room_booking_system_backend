import { Controller, Get } from '@nestjs/common';
import { Auth } from './decorator/auth.decorator';

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
  @Auth()
  @Permission(['aaa'])
  getAaa(): string {
    return 'a';
  }

  @Get('bbb')
  @Auth()
  @Permission(['bbb'])
  getBbb(): string {
    return 'b';
  }

  @Get('ccc')
  @Auth(false)
  @Permission(['ccc'])
  getCcc(): string {
    return 'c';
  }
}
