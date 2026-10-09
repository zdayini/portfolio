import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { ConcertsModule } from './concerts/concerts.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    ConcertsModule,
    MediaModule,
    AuthModule,
    SpotifyModule,
  ], // don't re-import ConfigModule in every feature module
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
