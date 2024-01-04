import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { Profile } from './entities/profile.entity';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() createProfileDto: CreateProfileDto, @Req() req) : Promise<Profile> {
    return this.profileService.create(createProfileDto, req.user);
  }

  @Get()
  @UseGuards(AuthGuard())
  async findOne(@Req() req) : Promise<any> {
    return this.profileService.findOne(req.user);
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(@Body() updateProfileDto: UpdateProfileDto, @Req() req) : Promise<Profile> {
    return this.profileService.update(updateProfileDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string, @Req() req): Promise<any> {
    return this.profileService.remove(id, req.user);
  }
}
