import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  const PORT = app.get(ConfigService).get('nest_server_port');

  await app.listen(PORT);

  console.log('server is running on port ' + PORT + ' .✈️..✈️..✈️..✈️.. ');
}

bootstrap();
