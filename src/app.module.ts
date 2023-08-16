import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './common/redis/redis.module';
import { UtilsModule } from './common/utils/utils.module';
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
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
    }),
    UserModule,
    RedisModule,
    UtilsModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
