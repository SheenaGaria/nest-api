import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
<<<<<<< HEAD
      username: 'postgres',
      password: 'Nextgen',
      database: 'nestdb',
=======
      username: 'postgres', 
      password: 'Nextgen', 
      database: 'nestdb', 
>>>>>>> 1b7c95f0118f749ee35e85ffc637264d00c8eba3
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
