import { Authorized } from 'routing-controllers';
import { Service } from 'typedi';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Usuario } from '../models';
import UsuarioQueryParams from '../models/queryParameters/UsuarioQueryParams';
import { UserRepository } from '../repositories/UserRepository';
import { Page } from '../shared/Page';
import { events } from '../subscribers/events';

@Service()
export class UsuarioService {

  constructor(
    @OrmRepository()
    private userRepository: UserRepository,
    @EventDispatcher()
    private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename)
    private log: LoggerInterface
  ) { }

  public async update(
    usuario: Usuario,
    partial: DeepPartial<Usuario>
  ): Promise<Usuario> {
    this.log.info('Update a user');
    this.userRepository.merge(usuario, partial);
    return await this.userRepository.save(usuario);
  }

  public async save(usuario: Usuario): Promise<Usuario> {
    const newUser = await this.userRepository.save(usuario);
    this.eventDispatcher.dispatch(events.user.created, newUser);
    this.log.info('Create a new user => ', usuario.toString());
    return newUser;
  }

  @Authorized()
  public async delete(id: string): Promise<void> {
    this.log.info('Delete a user');
    await this.userRepository.delete(id);
    return;
  }

  @Authorized()
  public async findAndPaginate(pageable: UsuarioQueryParams): Promise<Page<Usuario>> {
    const options = pageable.getOptions();
    const select = await this.userRepository.findAndCount(options);
    return new Page({ select, pageable });
  }

  @Authorized()
  public async find(options?: FindManyOptions<Usuario>): Promise<Usuario[]> {
    this.log.info('Find all users');
    return this.userRepository.find(options);
  }

  @Authorized()
  public async findOne(options?: FindOneOptions<Usuario>): Promise<Usuario> {
    this.log.info('Find one user');
    return this.userRepository.findOne(options);
  }

  @Authorized()
  public async findOneByEmail(usuario: Usuario): Promise<Usuario> {
    return this.userRepository.findOne({
      where: {
        email: usuario.email,
      },
    });
  }

}
