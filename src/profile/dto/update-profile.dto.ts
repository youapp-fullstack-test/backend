import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsNumber, IsEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Auth } from 'src/auth/entities/auth.entity';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly birthday: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly height: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly weight: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  readonly interests: string[];

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: Auth;
}
