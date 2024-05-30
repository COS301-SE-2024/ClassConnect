import { Body, Controller, Post, Put, Param , Delete} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";

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

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const updatedUser = await this.usersService.updateUser(id, updateUserDto);
        return updatedUser;
    }

    @Delete(':id')
    async deleteUser(@Param('id') id:string){
        const deletedUser= await this.usersService.deleteUser(id);
        return deletedUser;
    }

}