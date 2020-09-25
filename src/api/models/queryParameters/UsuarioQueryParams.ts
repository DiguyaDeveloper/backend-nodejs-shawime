import { FindManyOptions, Like, FindConditions } from "typeorm";
import Specification from "../../shared/Specification";
import { Usuario } from "../Usuario.model";
import Pagination from "../../shared/Pagination";

export default class UsuarioQueryParams extends Pagination
  implements Specification<Usuario> {
  fullname?: string;

  getOptions(): FindManyOptions<Usuario> {
    const where: FindConditions<Usuario> = {};

    if (this.fullname) {
      where.fullname = Like(`%${this.fullname}%`);
    }

    return this.paginate({
        where
    });
  }
}
