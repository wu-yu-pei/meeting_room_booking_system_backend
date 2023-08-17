import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @SetMetadata('require-login', false)
  getAaa(): string {
    return 'a';
  }

  @Get('bbb')
  @SetMetadata('require-login', true)
  getBbb(): string {
    return 'b';
  }
}
