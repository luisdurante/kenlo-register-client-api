import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './schemas/client.schema';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.insertOne(createClientDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<any> {
    const clients = await this.clientsService.findAll();
    return { clients };
  }
}
