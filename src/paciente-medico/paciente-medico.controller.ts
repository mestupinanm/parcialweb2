/* eslint-disable prettier/prettier */
import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
    constructor(private readonly pacienteMedicoService: PacienteMedicoService){}

    @Post(':pacienteId/medicos/:medicoId')
    async addMedicoMuseum(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string){
        return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    }
}
