/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';
import { faker } from '@faker-js/faker';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacienteList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacienteList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.name.firstName(),
        genero: faker.person.sex(),
      });
      pacienteList.push(paciente);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  //PRUEBA 1: Crear un paciente correctamente
  it('create debe crear un paciente correctamente', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: faker.name.firstName(), 
      genero: faker.person.sex(),
      medicos: [],
      diagnosticos: [],
    };

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({ where: { id: newPaciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
  });

  
  //PRUEBA 2: Lanzar excepción si el nombre tiene menos de 3 caracteres
  it('create debe lanzar una excepción si el nombre tiene menos de 3 caracteres', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: 'Jo', 
      genero: faker.person.sex(),
      medicos: [],
      diagnosticos: [],
    };
    await expect(service.create(paciente)).rejects.toHaveProperty('message','El nombre del paciente debe tener al menos 3 caracteres');
  });
});