import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { IsNotEmpty } from 'class-validator';

import { Usuario } from './Usuario.model'

@Entity({ schema: 'public' })
export class Role {

  constructor(id?: number) {
    this.id = id
  }

  @PrimaryGeneratedColumn()
  id: number

  @IsNotEmpty({
    message: 'The name is required'
  })
  @Column({ length: 50, type: 'varchar' })
  name: string

  @OneToMany(() => Usuario, (user: Usuario) => user.role)
  users: Usuario[];
}

export enum DefaultRole {
  Usuario = 1,
  Admin = 2
}