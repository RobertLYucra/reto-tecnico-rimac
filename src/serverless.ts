
import { configure } from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Handler } from 'aws-lambda';
import { HttpExceptionFilter } from './shared/middlewares/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Analytics')
    .setDescription('Report, Dashboards, etc')
    .setVersion('1.0')
    .addTag('analytics')
    .addServer("http://localhost:3000/test/api-platform-auth")
    .addServer('https://jooki0528l.execute-api.us-east-2.amazonaws.com/test/api-mailing-analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document, {
    customSiteTitle: 'API Docs',
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
  });
  app.use('/swagger-json', (req, res) => {
    res.json(document);
  });

  await app.init();

  const expressHandler = await app.getHttpAdapter().getInstance();

  return configure({ app: expressHandler });
}

export const handler: Handler = async (event: any, context, callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};