import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcrypt';
import { IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "./Role.model";

export enum UserStatus {
    Inactive = 'INACTIVE',
    Active = 'ACTIVE',
    Block = 'BLOCK',
    New = 'NEW'
}

export interface IUsuario {
    id: number
    fullname: string
    email: string
    username: string;
    password: string;
    estado: string;
    pais: string;
    help: boolean;
    status: UserStatus;
    termsAndConditions?: boolean;
    picture: string;
    roleId: number;
    role: Role;
    createDate: string;
    updateDate: string;
    token: string;
}

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: "Informe Nome" })
    @Column()
    fullname: string;

    @Column('varchar', { length: 50, name: 'email' })
    @IsEmail({ allow_display_name: true}, {
        message: 'The email is not valid'
    })
    @IsNotEmpty({
        message: 'Email is required'
    })
    email: string

    @Column()
    @IsNotEmpty({ message: "Informe Username" })
    username: string;

    @IsNotEmpty({ message: "Informe Senha" })
    @Column('varchar', { length: 255, name: 'password' })
    password: string

    @Column()
    @IsNotEmpty({ message: "Informe Estado" })
    estado: string;

    @Column()
    @IsNotEmpty({ message: "Informe Pais" })
    pais: string;

    @Column()
    @IsNotEmpty({ message: "Informe Help" })
    help: boolean;

    @Column('boolean', { default: false })
    @IsNotEmpty({ message: "Informe termsAndConditions" })
    termsAndConditions?: boolean;

    @Column()
    @IsNotEmpty({ message: "Informe Picture" })
    picture: string;

    @Column('int')
    roleId!: number;

    @ManyToOne(() => Role, role => role.users)
    role: Role;

    @Column('varchar', { default: UserStatus.New })
    @IsNotEmpty({
        message: 'The user status is required'
    })
    status: UserStatus;

    @CreateDateColumn({ type: 'timestamp', name: 'createDate', default: () => 'CURRENT_TIMESTAMP(6)' })
    createDate: string;

    @UpdateDateColumn({ type: 'timestamp', name: 'updateDate', default: () => 'CURRENT_TIMESTAMP(6)' })
    updateDate: string;

    @Column({ nullable: true })
    token: string;

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.password = await Usuario.hashPassword(this.password);
    }

    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    checkIfUnEncryptedPasswordIsValid (unEncryptedPassword: string): boolean {
        return bcrypt.compareSync(unEncryptedPassword, this.password)
    }

}