import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Auth } from 'src/auth/entities/auth.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProfileService {

  constructor(
    @InjectModel(Profile.name)
    private profileModel: mongoose.Model<Profile>
  ) {}

  async create(createProfileDto: CreateProfileDto, auth: Auth): Promise<Profile> {
    const data = Object.assign(createProfileDto, { user: auth._id });

    const res = await this.profileModel.create(data);
    return res;
  }

  async findOne(auth: Auth): Promise<any> {
    const profile = await this.profileModel.aggregate([
      { $project: { _id: '$$REMOVE' } },
      {$lookup:{
        from:'profiles',
        pipeline: [
          {$match:{
            'user':auth._id
          }}
        ],
        as:'profile'
      }},
      {$unwind:{
        path:'$profile',
        preserveNullAndEmptyArrays:true
      }},
      {$lookup:{
        from:'auths',
        pipeline: [
          {$match:{
            '_id':auth._id
          }}
        ],
        as:'auth'
      }},
      {$unwind:{
        path:'$auth',
        preserveNullAndEmptyArrays:false
      }},
      {$project:{
        "name": "$profile.name",
        "birthday": "$profile.birthday",
        "height": "$profile.height",
        "weight": "$profile.weight",
        "interests": "$profile.interests",
        "username":"$auth.username",
        "email":"$auth.email"
      }},
      {$limit:1}
    ]).exec();

    return profile[0];
  }

  async update(updateProfileDto: UpdateProfileDto, auth: Auth): Promise<Profile> {
    return await this.profileModel.findOneAndUpdate({'user':auth._id}, updateProfileDto, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id: string, auth: Auth): Promise<any> {
    const profile = await this.profileModel.findOne({'_id':new mongoose.Types.ObjectId(id), 'user':auth._id})

    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    await this.profileModel.deleteOne({'_id':profile._id})

    return this.findOne(auth);
  }
}
