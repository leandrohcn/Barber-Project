import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação Global com Configurações Robustas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                    // Remove campos não definidos
      forbidNonWhitelisted: true,         // Rejeita campos extras
      transform: true,                    // Transforma tipos automaticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: false,            // Retorna todos os erros
    }),
  );

  app.enableCors();

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Barber Shop API')
    .setDescription('API Multi-Tenant para Barbearia')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`📚 Swagger docs disponível em http://localhost:3001/api/docs`);
}
bootstrap();
