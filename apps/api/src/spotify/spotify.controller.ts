import { Controller, Get, Param, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
    constructor(private spotify: SpotifyService) { }

    @Get('search')
    search(@Query('artist') artist: string) {
        return this.spotify.searchArtist(artist);
    }

    @Get('artist/:id')
    getArtist(@Param('id') id: string) {
        return this.spotify.getArtist(id);
    }

    @Get('playlist/:id')
    getPlaylist(@Param('id') id: string) {
        return this.spotify.getPlaylist(id);
    }
}