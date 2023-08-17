import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilsService {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
  }

  getAccessToken(userInfo: {
    id: number;
    username: string;
    roles: string[];
    permissions: string[];
  }) {
    return this.jwtService.sign(
      {
        userId: userInfo.id,
        username: userInfo.username,
        roles: userInfo.roles,
        permissions: userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
  }

  getRefreshToken(userId: number) {
    return this.jwtService.sign(
      {
        userId,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
  }
}
