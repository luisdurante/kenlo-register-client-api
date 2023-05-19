import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getModelToken } from '@nestjs/mongoose';
import { ClientDocument } from './schemas/client.schema';
import { Model, Query } from 'mongoose';
import { createMock } from '@golevelup/ts-jest';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let clientsService: ClientsService;
  let clientsModel: Model<ClientDocument>;

  const mockClientsModel = {
    create: jest.fn(),
    find: jest.fn(),
    exec: jest.fn(),
  };

  const clientsMock = [
    {
      _id: '64665f32599da225fff800c4',
      name: 'Fulano da Silva',
      email: 'fulano@email.com',
      phoneNumber: '13998895544',
      __v: 0,
    },
    {
      _id: '64665f32599da225fff800c3',
      name: 'Ciclano da Silva',
      email: 'ciclano@email.com',
      phoneNumber: '5516998895544',
      __v: 0,
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getModelToken('Client'),
          useValue: mockClientsModel,
        },
      ],
    }).compile();

    clientsService = module.get<ClientsService>(ClientsService);
    clientsModel = module.get<Model<ClientDocument>>(getModelToken('Client'));
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(clientsService).toBeDefined();
    expect(clientsModel).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all clients', async () => {
      // Arrange
      jest.spyOn(clientsModel, 'find').mockReturnValueOnce(
        createMock<Query<ClientDocument[], ClientDocument>>({
          exec: jest.fn().mockResolvedValueOnce(clientsMock),
        }),
      );

      // Act
      const clients = await clientsService.findAll();

      // Assert
      expect(clients).toHaveLength(2);
      expect(mockClientsModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create client', () => {
    it('should create and return a valid client', async () => {
      // Arrange
      const clientDTOMock = {
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544',
      };

      mockClientsModel.create.mockReturnValue(clientsMock[0]);

      // Act
      const client = await clientsService.insertOne(clientDTOMock);

      // Assert
      expect(client).toMatchObject(clientsMock[0]);
      expect(mockClientsModel.create).toHaveBeenCalledTimes(1);
    });
  });
});
