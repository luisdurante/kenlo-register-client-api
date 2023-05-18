import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
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
      if (error.code === 11000)
        throw new ConflictException('Email already exists');
      throw new InternalServerErrorException(`Error code: ${error.code}`);
    }
  }

  async findAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
