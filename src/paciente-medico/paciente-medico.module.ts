/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
  providers: [PacienteMedicoService],
  controllers: [PacienteMedicoController]
})
export class PacienteMedicoModule {}
