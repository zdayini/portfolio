import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwt: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new UnauthorizedException();

        const token = authHeader.replace('Bearer ', '');
        try {
            this.jwt.verify(token);
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}