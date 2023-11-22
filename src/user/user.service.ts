import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FilterUserDto } from './dto/filter-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const userNotExist = !(await this.findOneByEmail(createUserDto.email));

      if (userNotExist) {
        const result = await this.userModel.create(createUserDto);

        if (result) {
          return {
            message: "User created successfully",
            code: HttpStatus.OK,
            data: result._id
          }
        }
      } else {
        return {
          message: `User with email ${createUserDto.email} already exists`,
          code: HttpStatus.FOUND,
        }
      }
      this.userModel.create(createUserDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<any[]> {
    return this.userModel.find({}).exec();
  }

  async findOne(id: string, request): Promise<any> {

    if (id !== request.id && request.role === Role.USER) {
      return {
        message: "You dont have access to this resource, verify your role",
        code: HttpStatus.UNAUTHORIZED
      }
    }

    return this.userModel.findById({ _id: id })
      .select('-password')
      .exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email })
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto, userInfo: any): Promise<any> {

    try {
      const user = await this.userModel.findById(id).exec();

      if (user) {
        const response = await this.userModel.findByIdAndUpdate(id, updateUserDto).exec();

        if (response) {
          return {
            message: "User updated successfully",
            code: HttpStatus.OK
          };
        }
      }

      return {
        message: "User not found",
        code: HttpStatus.NOT_FOUND
      };
    } catch (err) {
      console.error(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }

  async filter(filters: FilterUserDto): Promise<any> {
    try {
      return await this.userModel.find({
        ...(filters.name && { name: { $regex: filters.name, $options: 'i' } }),
        ...(filters.email && { email: { $regex: filters.email, $options: 'i' } }),
        ...(filters.role && { role: filters.role }),
        ...(filters.hasAssignedTeam && { hasAssignedTeam: filters.hasAssignedTeam }),
      })
        .select('-password')
        .exec();
    } catch (err) {
      console.error(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
