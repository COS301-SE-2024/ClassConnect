import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/createUser.dto";

@Controller('users')
export class UsersController{

    constructor(private usersService:UsersService){

    }
    //this is the create User endpoint
    @Post()
    createUser(@Body() createUsersDto: CreateUserDto){
        console.log(createUsersDto);
        return this.usersService.createUser(createUsersDto);
    }

}