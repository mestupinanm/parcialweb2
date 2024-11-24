/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BadRequestException, BusinessError, BusinessLogicException } from '../shared/error/business-error';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  
  //Método findAll
  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find();
  }


  //Método findOne
  async findOne(id: string): Promise<DiagnosticoEntity> {
    const diagnostico = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {
      throw new BusinessLogicException('The diagnostico with the given id was not found',BusinessError.NOT_FOUND);
    }
    return diagnostico;
  }


  //Método create
  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    //validación
    if (diagnostico.descripcion.length > 200) {
      throw new BadRequestException('The description must not exceed 200 characters', BusinessError.BAD_REQUEST);
    }
    //fin validacion
    return await this.diagnosticoRepository.save(diagnostico);
  }

  
  //Método delete
  async delete(id: string): Promise<void> {
    const diagnostico = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {throw new BusinessLogicException('The diagnostico with the given id was not found',BusinessError.NOT_FOUND);
    }
    await this.diagnosticoRepository.remove(diagnostico);
  }
}