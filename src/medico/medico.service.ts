/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import { BusinessError, BusinessLogicException } from '../shared/error/business-error';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}


  //Método findAll
  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find({ relations: ['pacientes'] });
  }


  //Método findOne
  async findOne(id: string): Promise<MedicoEntity> {
    const medico = await this.medicoRepository.findOne({where: { id }, relations: ['pacientes']});
    if (!medico) {
      throw new BusinessLogicException('El médico con el id proporcionado no fue encontrado',BusinessError.NOT_FOUND);
    }
    return medico;
  }


  //Método create
  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    //validacion
    if (!medico.nombre || !medico.especialidad) {
      throw new BusinessLogicException('El nombre y la especialidad no pueden estar vacíos',BusinessError.PRECONDITION_FAILED);
    }
    //fin validacion
    return await this.medicoRepository.save(medico);
  }


  //Método delete
  async delete(id: string): Promise<void> {
    const medico = await this.medicoRepository.findOne({where: { id },relations: ['pacientes']});
    if (!medico) {
        throw new BusinessLogicException('El médico con el id proporcionado no fue encontrado',BusinessError.NOT_FOUND);
    }
    if (medico.pacientes && medico.pacientes.length > 0) {
        throw new BusinessLogicException('No se puede eliminar un médico que tiene pacientes asociados',BusinessError.PRECONDITION_FAILED);
    }
    await this.medicoRepository.remove(medico);
  }
}