import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

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
}
