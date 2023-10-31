import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';

const { format } = winston;
const { combine, timestamp, printf } = format;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      transports: [new winston.transports.Console({})],
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.colorize(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  });

  // todo 路由鉴权

  await app.listen(3000);
}

bootstrap();
