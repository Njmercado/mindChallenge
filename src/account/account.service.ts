import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './schemas/acccount.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseAccountDto } from './dto/response-account.dto';

@Injectable()
export class AccountService {

  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  async create(createAccountDto: CreateAccountDto): Promise<ResponseAccountDto> {
    try {
      const saveResponse = await this.accountModel.create(createAccountDto);
      if(saveResponse._id) {
        return this.findOne(saveResponse._id.toString());
      }
    } catch(error) {
      console.log(error.message);
      return null;
    }
  }

  async findAll(): Promise<ResponseAccountDto[]> {
    return this.accountModel.find({});
  }

  async findOne(id: string): Promise<ResponseAccountDto> {
    return this.accountModel.findById(id);
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<ResponseAccountDto[]> {
    return this.accountModel.findByIdAndUpdate(id, updateAccountDto);
  }

  async remove(id: string) {
    return this.accountModel.findByIdAndDelete(id);
  }
}
