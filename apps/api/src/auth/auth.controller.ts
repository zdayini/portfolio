import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(private jwt: JwtService, private config: ConfigService) { }

    @Post('login')
    async login(@Body('password') password: string) {
        const hash = this.config.get('ADMIN_PASSWORD_HASH')!;
        const valid = await bcrypt.compare(password, hash);
        if (!valid) throw new UnauthorizedException('Wrong password');

        const token = this.jwt.sign({ role: 'admin' });
        return { token };
    }
}