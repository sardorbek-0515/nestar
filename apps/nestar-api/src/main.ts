import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// define
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT_API ?? 3000);
}

// call
bootstrap();
