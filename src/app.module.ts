import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './module/user/user.module';
import { User } from './module/user/entities/user.entity';
import { Role } from './module/user/entities/role.entity';
import { Permission } from './module/user/entities/permission.entity';
import { RedisModule } from './module/common/redis/redis.module';
import { UtilsModule } from './module/common/utils/utils.module';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guard/login.guard';
import defConfig from './config/def.config';
import devConfig from './config/dev.config';
import prodConfig from './config/prod.config';
import { PermissionGuard } from './guard/permission.guard';
import { isDev } from './utils';
import { TaskModule } from './module/task/task.module';

@Module({
  imports: [
    ...setupOptionalModules(),
    UserModule,
    RedisModule,
    UtilsModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}

/**
 * setup all need optional module
 * @returns {Array} Modules
 */

function setupOptionalModules() {
  const _ConfigModule = ConfigModule.forRoot({
    isGlobal: true,
    load: [defConfig, isDev() ? devConfig : prodConfig],
  });

  const _JwtModule = JwtModule.registerAsync({
    global: true,
    useFactory(configService: ConfigService) {
      return {
        secret: configService.get('jwt_secret'),
        signOptions: {
          expiresIn: configService.get('jwt_access_token_expires_time'),
        },
      };
    },
    inject: [ConfigService],
  });

  const _TypeOrmModule = TypeOrmModule.forRootAsync({
    useFactory(configService: ConfigService) {
      return {
        type: 'mysql',
        host: configService.get('mysql_server_host'),
        port: configService.get('mysql_server_port'),
        username: configService.get('mysql_server_username'),
        password: configService.get('mysql_server_password'),
        database:
          'meeting_room_booking_system_backend' ||
          configService.get('mysql_server_database'),
        synchronize: true,
        logging: false,
        entities: [User, Role, Permission],
        poolSize: 10,
        connectorPackage: 'mysql2',
      };
    },
    inject: [ConfigService],
  });

  const _ScheduleModule = ScheduleModule.forRoot();

  return [_ConfigModule, _JwtModule, _TypeOrmModule, _ScheduleModule];
}
