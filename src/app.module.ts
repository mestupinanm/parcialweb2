/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { PacienteModule } from './paciente/paciente.module';
import { MedicoModule } from './medico/medico.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico/medico.entity';
import { PacienteEntity } from './paciente/paciente.entity';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity';

@Module({
  imports: [MedicoModule, PacienteMedicoModule, PacienteModule, DiagnosticoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'paciente',
      entities: [MedicoEntity, PacienteEntity, DiagnosticoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    PacienteMedicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
