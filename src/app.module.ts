import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';

@Module({
  imports: [MedicoModule, PacienteModule, DiagnosticoModule, PacienteMedicoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
