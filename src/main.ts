import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const PORT = app.get(ConfigService).get('nest_server_port');

  await app.listen(PORT);

  console.log('server is running on port ' + PORT + ' .✈️..✈️..✈️..✈️.. ');
}
bootstrap();
