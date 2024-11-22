/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity'
import { MedicoEntity } from '../medico/medico.entity'; 

@Injectable()
export class MedicoPacienteService {

  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
    
    //Verificar si el paciente existe
    const paciente = await this.pacienteRepository.findOne({where: { id: pacienteId },relations: ['medicos']});
    if (!paciente) {
      throw new NotFoundException('Paciente con ID ${pacienteId} no encontrado.');
    }


    //Verificar si el médico existe
    const medico = await this.medicoRepository.findOne({where: { id: medicoId }});
    if (!medico) {
      throw new NotFoundException('Médico con ID ${medicoId} no encontrado.');
    }


    //Verificar que el paciente no tenga más de 5 médicos asignados
    if (paciente.medicos.length >= 5) {
      throw new BadRequestException('El paciente con ID ${pacienteId} ya tiene el máximo permitido de 5 médicos asignados.');
    }

    paciente.medicos = [...paciente.medicos, medico];
    return this.pacienteRepository.save(paciente);
  }
}
