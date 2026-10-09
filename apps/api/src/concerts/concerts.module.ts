import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { MediaModule } from '../media/media.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MediaModule, AuthModule],
  controllers: [ConcertsController],
  providers: [ConcertsService]
})
export class ConcertsModule { }
