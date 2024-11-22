/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../shared/error/business-error';

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
      throw new BusinessLogicException('El diagnóstico con el id proporcionado no fue encontrado',BusinessError.NOT_FOUND);
    }
    return diagnostico;
  }


  //Método create
  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    //validación
    if (diagnostico.descripcion.length > 200) {
      throw new BusinessLogicException('La descripción no puede tener más de 200 caracteres',BusinessError.PRECONDITION_FAILED);
    }
    //fin validacion
    return await this.diagnosticoRepository.save(diagnostico);
  }

  
  //Método delete
  async delete(id: string): Promise<void> {
    const diagnostico = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {throw new BusinessLogicException('El diagnóstico con el id proporcionado no fue encontrado',BusinessError.NOT_FOUND);
    }
    await this.diagnosticoRepository.remove(diagnostico);
  }
}