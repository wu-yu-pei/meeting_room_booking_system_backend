import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenJwtPayload, RefreshTokenJwtPayload } from '../interface';

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

  getAccessToken(payload: AccessTokenJwtPayload) {
    return this.jwtService.sign(
      {
        userId: payload.id,
        username: payload.username,
        roles: payload.roles,
        permissions: payload.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
  }

  getRefreshToken(payload: RefreshTokenJwtPayload) {
    return this.jwtService.sign(
      {
        userId: payload.userId,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
  }
}
