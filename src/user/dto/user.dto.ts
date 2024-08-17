import { MinLength, IsNotEmpty, IsNumber, IsOptional, IsEmail } from 'class-validator';
import { UserRole } from 'src/enum/user-role';

export class UpdateUserRoleRequest {
    @IsEmail()
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string;

    @IsOptional()
    role: UserRole;
}