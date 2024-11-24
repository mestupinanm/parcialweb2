/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity'
import { MedicoEntity } from '../medico/medico.entity'; 
import { BusinessError, BusinessLogicException } from '../shared/error/business-error';

@Injectable()
export class PacienteMedicoService {

  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
    
    //Verificar si el paciente existe
    const paciente = await this.pacienteRepository.findOne({where: { id: pacienteId },relations: ['medicos']});
    if (!paciente)
      throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);


    //Verificar si el médico existe
    const medico = await this.medicoRepository.findOne({where: { id: medicoId }});
    if (!medico)
      throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);


    //Verificar que el paciente no tenga más de 5 médicos asignados
    if (paciente.medicos.length >= 5) {
      throw new BusinessLogicException("The paciente has 5 or more medicos", BusinessError.PRECONDITION_FAILED);
    }

    paciente.medicos = [...paciente.medicos, medico];
    return this.pacienteRepository.save(paciente);
  }
}
