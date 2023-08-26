import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useSwagger(app);

  usePrefix(app);

  // app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new FormatResponseInterceptor());

  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  const PORT = app.get(ConfigService).get('nest_server_port');

  await app.listen(PORT);

  console.log(`|--> Nest is running on http://localhost:${PORT} <--|`);
}

bootstrap();

function useSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const title = configService.get('swagger_title');
  const description = configService.get('swagger_description');
  const version = configService.get('version');
  const path = configService.get('swagger_path');
  const port = configService.get('nest_server_port');
  const prefix = configService.get('prefix');

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addTag('test')
    .addServer(`http://localhost:${port}${prefix}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, document);
}

function usePrefix(app: INestApplication) {
  app.setGlobalPrefix(app.get(ConfigService).get('prefix'));
}
