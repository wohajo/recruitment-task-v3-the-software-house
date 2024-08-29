import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JsonDbService } from './json-db.service';

@Module({
  imports: [ConfigModule],
  providers: [JsonDbService],
  exports: [JsonDbService],
})
export class JsonDbModule {}
