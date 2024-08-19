import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import * as argon from 'argon2';
import { BookmarkEntity } from "src/entity/entity.bookmark";
import { UserEntity } from "src/entity/entity.user";
import { UserRole } from "src/enum/user-role";
import { DataSource, Repository } from "typeorm";
import { AuthDto } from "./dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        @InjectRepository(BookmarkEntity)
        private bookmarkRepository: Repository<BookmarkEntity>,

        private config: ConfigService,
        private jwt: JwtService,

        @InjectDataSource() 
        private readonly dataSource: DataSource
    ) {}

    async signup(authdto: AuthDto) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        // Generate password hash
        const hash = await argon.hash(authdto.password);

        const user = this.userRepository.create({
            email: authdto.email,
            hash,
            role: UserRole.GUEST
        })

        try{
            const savedUser = await queryRunner.manager.save(UserEntity, user);

            // Create new bookmark for test
            const bookmark = this.bookmarkRepository.create({
                title: "Title",
                description: "Description",
                link: "Link",
                user: savedUser
            })
            
            await queryRunner.manager.save(BookmarkEntity, bookmark);
            await queryRunner.commitTransaction();

            return this.signToken(savedUser.id, savedUser.email);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Transaction failed, changes rolled back.');
        } finally {
            await queryRunner.release();
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