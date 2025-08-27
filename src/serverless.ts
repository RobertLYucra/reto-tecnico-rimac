
import { configure } from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Handler } from 'aws-lambda';
import { HttpExceptionFilter } from './shared/middlewares/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TopicAppoitmentUseCase } from './modules/appointment/application/topic-appointment.use.case';
import { PeCreateTopicAppoitmentUseCase } from './modules/appointment-peru/application/peru-create-topic-appointment.use.case';
import { UpdateAppoitmentUseCase } from './modules/appointment/application/update-appointment.usecase';
import { ClCreateTopicAppoitmentUseCase } from './modules/appointment-chile/application/chile-create-topic-appointment.use.case';


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
    .setTitle('API Appointment')
    .setDescription('Registro de citas')
    .setVersion('1.0')
    .addTag('appointment')
    .addServer("http://localhost:3000/test/api-appointment")
    .addServer('https://y8vea5ly72.execute-api.us-east-2.amazonaws.com/test/api-appointment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document, {
    customSiteTitle: 'API Appointment',
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

export const appointmentTopic: Handler = async (event) => {
  const appContext = await NestFactory.create(AppModule, { logger: false });
  const eventService = appContext.get(TopicAppoitmentUseCase);

  const record = event.Records[0];
  const snsMessage = JSON.parse(record.Sns.Message);

  return eventService.topicAppointment(snsMessage);
};


export const peruTopicAppointmentHandler: Handler = async (event: any) => {
  const appContext = await NestFactory.create(AppModule, { logger: false });
  const eventService = appContext.get(PeCreateTopicAppoitmentUseCase);

  try {
    for (const record of event.Records) {
      try {
        const payload = JSON.parse(record.body);
        const { data } = payload;
        await eventService.peruTopicAppointment(data);
      } catch (error) {
        console.error('Error procesando mensaje del batch:', error.message, record.body);
      }
    }
  } finally {
    // Libera recursos
    await appContext.close();
  }

  return { statusCode: 200, body: 'Processed all records' };
};


export const chileTopicAppointmentHandler: Handler = async (event: any) => {
  const appContext = await NestFactory.create(AppModule, { logger: false });
  const eventService = appContext.get(ClCreateTopicAppoitmentUseCase);

  try {
    for (const record of event.Records) {
      try {
        const payload = JSON.parse(record.body);
        const { data } = payload;

        await eventService.chileTopicAppointment(data);
      } catch (error) {
        console.error('Error procesando mensaje del batch:', error.message, record.body);
      }
    }
  } finally {
    // Libera recursos
    await appContext.close();
  }

  return { statusCode: 200, body: 'Processed all records' };
};

export const confirmAppointmentHandler: Handler = async (event) => {
  const appContext = await NestFactory.create(AppModule, { logger: false });
  const eventService = appContext.get(UpdateAppoitmentUseCase);

  for (const record of event.Records) {
    try {
      const payload = JSON.parse(record.body);
      await eventService.updateAppointment(payload.detail);
    } catch (error) {
      console.error('Error procesando mensaje del batch:', error.message, record.body);
    }
  }

}
