import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ConflictException } from '@nestjs/common';

describe('ClientsController', () => {
  let clientsController: ClientsController;
  let clientsService: ClientsService;

  const mockClientsService = {
    insertOne: jest.fn(),
    findAll: jest.fn(),
  };

  const clientsMock = [
    {
      _id: '64665f32599da225fff800c4',
      name: 'Fulano da Silva',
      email: 'fulano@email.com',
      phoneNumber: '13998895544',
    },
    {
      _id: '64665f32599da225fff800c3',
      name: 'Ciclano da Silva',
      email: 'ciclano@email.com',
      phoneNumber: '5516998895544',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsController,
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    }).compile();

    clientsController = module.get<ClientsController>(ClientsController);
    clientsService = module.get<ClientsService>(ClientsService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(clientsController).toBeDefined();
    expect(clientsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      jest
        .spyOn(clientsService, 'findAll')
        .mockImplementation(async () => clientsMock);

      // Act
      const result = await clientsController.findAll();

      // Assert
      expect(result.clients).toHaveLength(2);
      expect(mockClientsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should return a created client', async () => {
      // Arrange
      const clientDTOMock = {
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544',
      };

      mockClientsService.insertOne.mockReturnValue(clientsMock[0]);

      // Act
      const client = await clientsController.create(clientDTOMock);

      // Assert
      expect(client).toMatchObject(clientDTOMock);
      expect(mockClientsService.insertOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw an conflict exception because email already exists', async () => {
      // Arrange
      const clientDTOMock = {
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544',
      };

      mockClientsService.insertOne.mockRejectedValueOnce(
        new ConflictException('Email already exists'),
      );

      // Act, Assert
      await expect(
        async () => await clientsController.create(clientDTOMock),
      ).rejects.toThrow(ConflictException);

      expect(mockClientsService.insertOne).toHaveBeenCalledTimes(1);
    });
  });
});
