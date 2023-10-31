import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger, Module } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppConfig } from 'src/interface/AppConfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {
  constructor(
    @Inject(CACHE_MANAGER) private readonly redis: Cache,
    private readonly log: Logger,
  ) {
    this.initApp(redis);
  }

  async initApp(redis: Cache) {
    this.log.log('***************** loading app config *****************');

    let config: AppConfig = await redis.get('pda:config');

    if (!config) {
      config = {
        ipaPath: '/root/data/ipa',
        tmpPath: '/root/data/tmp',
      };

      await this.redis.set('pda:config', config);
    }

    this.log.log(`${JSON.stringify(config)} \n ***************** app config ************************`);
  }
}
