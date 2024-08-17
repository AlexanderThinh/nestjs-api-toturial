import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@Req() req: Request) {
        // When use @UseGuards(JwtGuard), the req is received from method validate of class JwtStrategy
        //  and req.user is a default of application
        return req.user; 
    }
}
