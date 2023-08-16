import { Controller, Get, Post, Body, Query, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/common/email/email.service';
import { RedisService } from 'src/common/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser, false);
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser, true);
  }

  @Get('initData')
  initData() {
    return this.userService.initData();
  }
}
