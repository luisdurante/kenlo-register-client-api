import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_HOST, {
      useNewUrlParser: true,
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
    }),
    ClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
