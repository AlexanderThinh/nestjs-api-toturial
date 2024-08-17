import { UserEntity } from "src/entity/entity.user";
import { UserRole } from "src/enum/user-role";

export class UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, firstName: string, lastName: string, email: string, role: UserRole,
        createdAt: Date, updatedAt: Date) {
        this.id = id ?? 0;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static bring(user: UserEntity): UserResponse {
        return new UserResponse(
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.role,
            user.createdAt,
            user.updatedAt
        );
    }
}