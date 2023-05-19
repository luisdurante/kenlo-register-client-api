import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './schemas/client.schema';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async insertOne(createClientDto: CreateClientDto) {
    try {
      const client = await this.clientModel.create(createClientDto);
      return client;
    } catch (error) {
      throw new InternalServerErrorException(`Error code: ${error.code}`);
    }
  }

  findAll(): Promise<Client[]> {
    return this.clientModel
      .find({ email: { $exists: true } }, { __v: 0 })
      .exec();
  }
}
