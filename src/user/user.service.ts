import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/entity.user';
import { UserResponse } from 'src/response/reponse.user';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async getUserInfo(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if(!user) {
            throw new NotFoundException('User not found');
        }

        return UserResponse.bring(user);
    }
}
