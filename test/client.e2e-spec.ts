import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { DatabaseService } from '../src/database/database.service';

describe('ClientsController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('clients').deleteMany({});
  });

  describe('GET /clients', () => {
    it('should return an array of clients', async () => {
      // Arrange
      const client = {
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544',
      };

      await dbConnection.collection('clients').insertOne(client);

      // Act
      const response = await request(httpServer).get('/clients');

      // Assert
      expect(response.body).toEqual({
        clients: expect.arrayContaining([
          expect.objectContaining({
            name: 'Fulano da Silva',
            email: 'fulano@email.com',
            phoneNumber: '13998895544',
          }),
        ]),
      });
    });

    it('should return an empty array', async () => {
      // Arrange

      // Act
      const response = await request(httpServer).get('/clients');

      // Assert
      expect(response.body).toEqual({
        clients: expect.arrayContaining([]),
      });

      expect(response.body.clients).toHaveLength(0);
    });
  });

  describe('POST /clients', () => {
    it('should return a created client', async () => {
      // Arrange
      const client = {
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544',
      };

      // Act
      const response = await request(httpServer).post('/clients').send(client);

      // Assert
      expect(response.body).toMatchObject(client);
    });

    it('should throw an Conflict exception because email already exists', async () => {
      // Arrange
      await dbConnection.collection('clients').insertOne({
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544',
      });

      // Act
      const response = await request(httpServer).post('/clients').send({
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544',
      });

      // Assert
      expect(response.statusCode).toEqual(409);
      expect(JSON.parse(response.text)).toMatchObject({
        message: 'Email already exists',
      });
    });

    it('should throw an Bad Request exception because request data is wrong', async () => {
      // Arrange
      const client = {
        name: 'Fulano da Silva',
        email: 'fulano@email.com',
        phoneNumber: '13998895544f',
      };

      // Act
      const response = await request(httpServer).post('/clients').send(client);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(JSON.parse(response.text)).toMatchObject({
        message: ['phoneNumber must be a valid brazilian number.'],
      });
    });
  });
});
