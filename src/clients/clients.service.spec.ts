import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getModelToken } from '@nestjs/mongoose';
import { ClientDocument } from './schemas/client.schema';
import { Model, Query } from 'mongoose';
import { createMock } from '@golevelup/ts-jest';

describe('UsersService', () => {
  let clientsService: ClientsService;
  let clientsModel: Model<ClientDocument>;

  const mockClientsModel = {
    create: jest.fn(),
    find: jest.fn(),
    exec: jest.fn(),
  };

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
  });

  describe('findAll', () => {
    it('should return all clients', async () => {
      // Arrange
      jest.spyOn(clientsModel, 'find').mockReturnValueOnce(
        createMock<Query<ClientDocument[], ClientDocument>>({
          exec: jest.fn().mockResolvedValueOnce([]),
        }),
      );

      // Act
      const clients = await clientsService.findAll();

      // Assert
      expect(clients).toHaveLength(0);
      expect(mockClientsModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create client', () => {
    it('should create and return a valid client', async () => {
      // Arrange
      const clientMock = {
        _id: '64665f32599da225fff800c4',
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544',
      };
      mockClientsModel.create.mockReturnValue(clientMock);

      // Act
      const client = await clientsService.insertOne(clientMock);

      // Assert
      expect(client).toMatchObject(clientMock);
      expect(mockClientsModel.create).toHaveBeenCalledTimes(1);
    });
  });
});
