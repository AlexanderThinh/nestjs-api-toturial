import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entity/entity.user";
import { QueryFailedError, Repository } from "typeorm";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { UserResponse } from "src/response/reponse.user";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async signup(authdto: AuthDto) {
        try {
            // Generate password hash
            const hash = await argon.hash(authdto.password);

            // Save new user in db
            const user = await this.userRepository.create({
                email: authdto.email,
                hash
            })

            const savedUser = await this.userRepository.save(user);
            // Return saved user 
            return UserResponse.bring(savedUser);
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

        // Return user
        return UserResponse.bring(user);
    }
}