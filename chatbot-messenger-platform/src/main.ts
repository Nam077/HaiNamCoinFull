import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
    const config = new DocumentBuilder()
        .setTitle('NVN Chat Bot')
        .setDescription('Chat bot for NVN')
        .setVersion('1.0')
        .addTag('chat-bot')
        .addBearerAuth()
        .setExternalDoc('For more information', '')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    console.clear();
    await app.listen(3000);
    console.clear();
}

bootstrap();
