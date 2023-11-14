import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './schemas/acccount.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AccountService {

  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  async create(createAccountDto: CreateAccountDto): Promise<any> {
    try {
      const saveResponse = await this.accountModel.create(createAccountDto);
      if(saveResponse._id) {
        return saveResponse;
      }
    } catch(error) {
      console.log(error.message);
      return null;
    }
  }

  async findAll(): Promise<any[]> {
    return this.accountModel.find({}).exec();
  }

  async findOne(id: string): Promise<any> {
    return this.accountModel.findById(id).exec();
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<any> {
    return this.accountModel.findByIdAndUpdate(id, updateAccountDto).exec();
  }

  async remove(id: string) {
    return this.accountModel.findByIdAndDelete(id).exec();
  }
}
