import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppConfig } from 'src/interface/AppConfig';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly redis: Cache,
    private readonly log: Logger,
  ) {}

  async getConfig() {
    const config: AppConfig = await this.redis.get('pda:config');

    return config;
  }
}
