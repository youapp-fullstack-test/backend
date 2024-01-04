import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<Auth>,
    private jwtService: JwtService,
  ) {}
  
  async create(registerDto: RegisterDto): Promise<{ token: string }> {
    const { username, email, password, confirmPassword } = registerDto;

    if (password != confirmPassword) {
      throw new NotAcceptableException('Password not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const auth = await this.authModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: auth._id, username: auth.username, email: auth.email });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;

    const auth = await this.authModel.findOne({
      $or: [
        {
          username: { $regex: username, $options: "i" },
        },
        {
          email: { $regex: username, $options: "i" },
        }
      ]
    });

    if (!auth) {
      throw new NotFoundException('user not found');
    }

    const isPasswordMatched = await bcrypt.compare(password, auth.password);

    if (!isPasswordMatched) {
      throw new NotAcceptableException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: auth._id, username: auth.username, email: auth.email });

    return { token };
  }
}
