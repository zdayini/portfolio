import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://localhost:5173', 'https://portfolio-five-sooty-ckg8z17vlj.vercel.app/'], });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();