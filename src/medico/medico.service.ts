/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import { BadRequestException, BusinessError, BusinessLogicException } from '../shared/error/business-error';

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
      throw new BusinessLogicException('The medico with the given id was not found',BusinessError.NOT_FOUND);
    }
    return medico;
  }


  //Método create
  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    if (medico.nombre.trim() === ''){
            throw new BadRequestException('The name can not be empty', BusinessError.BAD_REQUEST);
        }
    if (medico.especialidad.trim() === ''){
        throw new BadRequestException('The especialidad can not be empty', BusinessError.BAD_REQUEST);
    }
    return await this.medicoRepository.save(medico);
  }


  //Método delete
  async delete(id: string): Promise<void> {
    const medico = await this.medicoRepository.findOne({where: { id },relations: ['pacientes']});
    if (!medico) {
        throw new BusinessLogicException('The medico with the given id was not found',BusinessError.NOT_FOUND);
    }
    if (medico.pacientes && medico.pacientes.length > 0) {
        throw new BusinessLogicException('No se puede eliminar un médico que tiene pacientes asociados',BusinessError.PRECONDITION_FAILED);
    }
    await this.medicoRepository.remove(medico);
  }
}