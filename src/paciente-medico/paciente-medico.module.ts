/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MedicoPacienteService } from './paciente-medico.service';

@Module({
  providers: [MedicoPacienteService]
})
export class MedicoPacienteMedicoModule {}
