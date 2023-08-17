import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/module/common/email/email.service';
import { RedisService } from 'src/module/common/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from 'src/module/common/utils/utils.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(UtilsService) private readonly utilsService: UtilsService,
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
    const vo = await this.userService.login(loginUser, false);

    vo.accessToken = this.utilsService.getAccessToken({
      id: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions,
    });

    vo.refreshToken = this.utilsService.getRefreshToken({
      userId: vo.userInfo.id,
    });

    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);

    vo.accessToken = this.utilsService.getAccessToken({
      id: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions,
    });

    vo.refreshToken = this.utilsService.getRefreshToken({
      userId: vo.userInfo.id,
    });

    return vo;
  }

  @Get('initData')
  initData() {
    return this.userService.initData();
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);

      const access_token = this.utilsService.getAccessToken({
        id: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      });

      const refresh_token = this.utilsService.getRefreshToken({
        userId: user.id,
      });

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      const access_token = this.utilsService.getAccessToken({
        id: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      });

      const refresh_token = this.utilsService.getRefreshToken({
        userId: user.id,
      });

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
}
