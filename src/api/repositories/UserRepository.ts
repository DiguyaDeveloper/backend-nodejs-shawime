import { EntityRepository, Repository } from 'typeorm';
import { Usuario } from '../models/Usuario.model';

@EntityRepository(Usuario)
export class UserRepository extends Repository<Usuario>  {

}
