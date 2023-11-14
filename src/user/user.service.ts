import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findAll(): Promise<ResponseUserDto[]> {
    return this.userModel.find({});
  }

  // TODO: look for why i cant return de ResponseUserDto
  async findOne(id: number): Promise<any> {
    return this.userModel.find({_id: id}).exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: number) {
    return this.userModel.deleteOne({_id: id});
  }
}
