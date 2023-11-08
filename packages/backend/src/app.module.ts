import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ioRedisStore } from '@tirke/node-cache-manager-ioredis';
import * as process from 'process';
import { AppModule as AppxModule } from './app/app.module';
import { ConfigModule as ConfigxModule } from './config/config.module';

// 系统环境变量优先级最高
const env = process.env;
const envFilePath = ['.env'];
if (env.NODE_ENV === 'production') {
  envFilePath.push('.env.production');
} else {
  envFilePath.push('.env.development');
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: ioRedisStore({
          host: env.REDIS_HOST || config.get('REDIS_HOST') || '127.0.0.1',
          port: parseInt(env.REDIS_PORT) || config.get('REDIS_PORT') || 6379,
          db: parseInt(env.REDIS_DB) || config.get('REDIS_DB') || 0,
          password: env.REDIS_PASSWORD || config.get('REDIS_PASSWORD') || '',
        }),
      }),
    }),
    AppxModule,
    ConfigModule,
    ConfigxModule,
  ],
})
export class AppModule {}
