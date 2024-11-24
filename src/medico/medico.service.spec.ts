/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MedicoEntity } from './medico.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    medicosList = [];
    for(let i = 0; i < 5; i++){
        const medico: MedicoEntity = await repository.save({
        nombre: faker.person.firstName(), 
        especialidad: faker.person.jobTitle()})
        medicosList.push(medico);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all medicos', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toHaveLength(medicosList.length);
  });

  it('findOne should return a medico by id', async () => {
    const storedMedico: MedicoEntity = medicosList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.nombre).toEqual(storedMedico.nombre)
    expect(medico.especialidad).toEqual(storedMedico.especialidad)
  });

  it('findOne should throw an exception for an invalid medico', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The medico with the given id was not found")
  });

  it('create should return a new medico', async () => {
    const medico: MedicoEntity = {
      id: "",
      nombre: faker.person.firstName(), 
      especialidad: faker.person.jobTitle(), 
      pacientes: []
    }

    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await repository.findOne({where: {id: newMedico.id}})
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(newMedico.nombre)
    expect(storedMedico.especialidad).toEqual(newMedico.especialidad)
  });

  it('create should throw an exception for an invalid nombre', async () => {
    const medico: MedicoEntity = {  
      id: "",
      nombre: "",
      especialidad: faker.person.jobTitle(), 
      pacientes: []
    }
    await expect(service.create(medico)).rejects.toHaveProperty("message", "The name can not be empty");
  });

  it('delete should remove a medico', async () => {
    const medico: MedicoEntity = medicosList[0];
    await service.delete(medico.id);
    const deletedMedico: MedicoEntity = await repository.findOne({ where: { id: medico.id } })
    expect(deletedMedico).toBeNull();
  });

  it('delete should throw an exception for an invalid medico', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The medico with the given id was not found")
  });

});