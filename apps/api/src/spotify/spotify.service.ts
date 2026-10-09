import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpotifyService {
    private token: string | null = null;
    private tokenExpiresAt = 0;

    constructor(private config: ConfigService, private http: HttpService) { }

    private async getToken(): Promise<string> {
        if (this.token && Date.now() < this.tokenExpiresAt) {
            return this.token;
        }

        const clientId = this.config.get('SPOTIFY_CLIENT_ID');
        const clientSecret = this.config.get('SPOTIFY_CLIENT_SECRET');
        const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const res = await firstValueFrom(
            this.http.post(
                'https://accounts.spotify.com/api/token',
                'grant_type=client_credentials',
                {
                    headers: {
                        Authorization: `Basic ${basic}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            ),
        );

        this.token = res.data.access_token;
        this.tokenExpiresAt = Date.now() + res.data.expires_in * 1000 - 60_000; // refresh 1 min early
        return this.token!;
    }

    async getArtist(artistId: string) {
        const token = await this.getToken();
        const res = await firstValueFrom(
            this.http.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        );
        return res.data;
    }

    async searchArtist(name: string) {
        const token = await this.getToken();
        const res = await firstValueFrom(
            this.http.get('https://api.spotify.com/v1/search', {
                headers: { Authorization: `Bearer ${token}` },
                params: { q: name, type: 'artist', limit: 5 },
            }),
        );
        return res.data.artists.items;
    }

    async getPlaylist(playlistId: string) {
        const token = await this.getToken();
        const res = await firstValueFrom(
            this.http.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        );
        return res.data;
    }

}