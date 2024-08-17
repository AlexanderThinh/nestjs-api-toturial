import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as argon from 'argon2';
import { UserEntity } from "src/entity/entity.user";
import { Repository } from "typeorm";
import { AuthDto } from "./dto";
import { UserRole } from "src/enum/user-role";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        private config: ConfigService,
        private jwt: JwtService
    ) {}

    async signup(authdto: AuthDto) {
        try {
            // Generate password hash
            const hash = await argon.hash(authdto.password);

            // Save new user in db
            const user = this.userRepository.create({
                email: authdto.email,
                hash,
                role: UserRole.GUEST
            })

            const savedUser = await this.userRepository.save(user);
            // Return saved user 
            return this.signToken(savedUser.id, savedUser.email);
        } catch (error) {
            throw new ForbiddenException('Credentials taken');
        }
    }

    async signin(authdto: AuthDto) {
        // Find user by email, if not exist throw exception
        const user = await this.userRepository.findOne({ where: { email: authdto.email } });
        if(!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        // Compare password, if incorrect, throw exception
        const pwMatches = await argon.verify(user.hash, authdto.password);
        if(!pwMatches) {
            throw new ForbiddenException('Credentials incorrect')
        }

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');
        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '2m',
            secret: secret
        });

        return {
            access_token: accessToken
        }
    }
}