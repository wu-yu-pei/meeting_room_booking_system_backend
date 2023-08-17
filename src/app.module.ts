import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './common/redis/redis.module';
import { UtilsModule } from './common/utils/utils.module';
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    ...setupOptionalModules(),
    UserModule,
    RedisModule,
    UtilsModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/**
 * setup all need optional module
 * @returns {Array} Modules
 */

function setupOptionalModules() {
  const _ConfigModule = ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  });

  const _JwtModule = JwtModule.registerAsync({
    global: true,
    useFactory(configService: ConfigService) {
      return {
        secret: configService.get('jwt_secret'),
        signOptions: {
          expiresIn: '30m',
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

  return [_ConfigModule, _JwtModule, _TypeOrmModule];
}
