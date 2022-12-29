import { AuthService } from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
export interface JwtPayload {
    id: string;
    email: string;
}
export class AtStrategy extends PassportStrategy(Strategy, 'at') {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'nvn-font',
        });
    }

    async validate(payload: JwtPayload) {
        if (await this.authService.validateUser(payload)) {
            return payload;
        } else throw new ForbiddenException({ message: 'Invalid token' });
    }
}
