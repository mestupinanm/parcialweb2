/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { BusinessError, BusinessLogicException } from '../shared/error/business-error';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}


  //Método findAll
  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({ relations: ['diagnosticos'] });
  }


  //Método findOne
  async findOne(id: string): Promise<PacienteEntity> {
    const paciente = await this.pacienteRepository.findOne({where: { id },relations: ['diagnosticos']});
    if (!paciente) {throw new BusinessLogicException('El paciente con el id proporcionado no fue encontrado',BusinessError.NOT_FOUND);
    }
    return paciente;
  }


  //Método create
  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    //validación
    if (!paciente.nombre || paciente.nombre.trim().length < 3) {
        throw new BusinessLogicException('El nombre del paciente debe tener al menos 3 caracteres',BusinessError.PRECONDITION_FAILED);
    }
    //fin validacion
    return await this.pacienteRepository.save(paciente);
  }


  //Método delete
  async delete(id: string): Promise<void> {
    const paciente = await this.pacienteRepository.findOne({where: { id },relations: ['diagnosticos']});
    if (!paciente) {
      throw new BusinessLogicException('El paciente con el id proporcionado no fue encontrado',BusinessError.NOT_FOUND);
    }

    if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
      throw new BusinessLogicException('No se puede eliminar un paciente que tiene diagnósticos asociados',BusinessError.PRECONDITION_FAILED);
    }
    await this.pacienteRepository.remove(paciente);
  }
}