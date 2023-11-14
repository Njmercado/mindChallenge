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

  async findAll(): Promise<any[]> {
    return this.userModel.find({}).exec();
  }

  async findOne(id: string): Promise<any> {
    return this.userModel.findById({_id: id})
      .select('-password')
      .exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email })
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async remove(id: string) {
    return this.userModel.deleteOne({_id: id}).exec();
  }
}
