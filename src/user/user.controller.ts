import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { UserResponse } from 'src/response/reponse.user';
import { UpdateUserRoleRequest } from './dto/user.dto';
import { UserService } from './user.service';
import { UserRole } from 'src/enum/user-role';

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: UserResponse) {
        // When use @UseGuards(JwtGuard), the req is received from method validate of class JwtStrategy
        //  and req.user is a default of application
        // return req.user; 

        return user; 
    }

    @Roles(UserRole.ADMIN)
    @Put('user-role')
    async updateUserRole(@GetUser() currentUser: UserResponse, @Body() updateUserRoleRequest: UpdateUserRoleRequest) {
        // console.log('currentUser', currentUser);
        
        const userResponse = await this.userService.updateUserRole(updateUserRoleRequest);
        return userResponse;
    }
}
