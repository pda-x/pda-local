import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // todo 路由鉴权

  await app.listen(3000);
}

bootstrap();
