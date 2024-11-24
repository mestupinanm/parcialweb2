/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from '../paciente/paciente.entity';
import { Repository } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let paciente: PacienteEntity;
  let medicosList : MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    medicoRepository.clear();
    pacienteRepository.clear();
 
    medicosList = [];
    for(let i = 0; i < 5; i++){
        const medico: MedicoEntity = await medicoRepository.save({
          nombre: faker.person.firstName(), 
          especialidad: faker.person.jobTitle()
        })
        medicosList.push(medico);
    }
 
    paciente = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: faker.person.sex(),
      medicos: medicosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoPaciente should add an medico to a paciente', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.firstName(), 
      especialidad: faker.person.jobTitle()
    });

    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: faker.person.sex()
    })

    const result: PacienteEntity = await service.addMedicoToPaciente(newPaciente.id, newMedico.id);
    
    expect(result.medicos.length).toBe(1);
    expect(result.medicos[0]).not.toBeNull();
    expect(result.medicos[0].nombre).toBe(newMedico.nombre)
    expect(result.medicos[0].especialidad).toBe(newMedico.especialidad)

  });

  it('addMedicoPaciente should thrown exception for an invalid medico', async () => {
    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: faker.person.sex()
    })

    await expect(() => service.addMedicoToPaciente(newPaciente.id, "0")).rejects.toHaveProperty("message", "The medico with the given id was not found");
  });

});
