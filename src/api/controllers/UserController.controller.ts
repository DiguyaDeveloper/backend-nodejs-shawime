import { Response } from 'express';
import {
    Body, Delete, Get, JsonController, NotFoundError, Param, Post, Put
} from 'routing-controllers';

import { Usuario } from '../models/Usuario.model';
import { UsuarioService } from '../services/UsuarioService';
import { CustomError } from './errors/CustomError';
import { EnumError } from './errors/Error';

@JsonController('/usuarios')
export class UserController {

  constructor(
    private userService: UsuarioService
  ) { }

  @Get()
  public find(): Promise<Usuario[]> {
    return this.userService.find();
  }

  @Post()
  public async store(@Body() usuario: Usuario): Promise<Usuario> {

    const user = await this.userService.findOneByEmail(usuario);

    if (user) {
      throw new CustomError(400, 'Usuário já existe', { id: EnumError.USUARIO_EXISTENTE });
    }

    return this.userService.save(usuario);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() body: Usuario, res: Response): Promise<Usuario> {
    const usuario = await this.userService.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundError();
    }

    const { id: _id, password: _senha, ...partial } = body;

    try {
      const updated = await this.userService.update(usuario, partial);
      return updated;
    } catch (e) {
      throw new CustomError(409, 'Erro ao editar usuário' + JSON.stringify(e));
    }
  }

  @Delete('/:id')
  public delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  /**
 * @swagger
 * definitions:
 *  UserResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      username:
 *        type: string
 */

  /**
   * @swagger
   * definitions:
   *  CreateUser:
   *    type: object
   *    properties:
   *      fullname:
   *        type: string
   *        example: lorem
   *      email:
   *        type: string
   *        example: lorem@ipsun.com
   *      username:
   *        type: string
   *        example: lorem
   *      password:
   *        type: string
   *        example: lorem
   *      estado:
   *        type: string
   *        example: PR
   *      pais:
   *        type: string
   *        example: lorem
   *      help:
   *        type: boolean
   *        example: false
   *      termsAndConditions:
   *        type: boolean
   *        example: false
   *      picture:
   *        type: string
   *        example: local
   *      roleId:
   *        type: number
   *        example: 1
   *      status:
   *        type: new
   *        example: 1
   * 		required:
   *      - fullname
   *      - email
   *      - username
   *      - password
   *      - estado
   *      - pais
   *      - help
   *      - termsAndConditions
   *      - picture
   *      - roleId
   *      - status
   */

  /**
   * @swagger
   * definitions:
   *  LoginUser:
   *    type: object
   *    properties:
   *      username:
   *        type: string
   *        example: chnirt
   *      password:
   *        type: string
   *        example: "0"
   * 		required:
   *      - username
   *      - password
   */

  /**
   * @swagger
   * definitions:
   *  ErrorResponse:
   *    type: object
   *    properties:
   *      message:
   *        type: string
   *      status:
   *        type: number
   *      property:
   *        type: any
   */

  /**
   * @swagger
   * definitions:
   *  ValidateErrorResponse:
   *    type: object
   *    properties:
   *      errors:
   *        type: array
   *        items:
   *            $ref: "#/definitions/UserResponse"
   */

  /**
   * @swagger
   * /users:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *     - users
   *     summary: Get users 👻
   *     description: Ok
   *     consumes:
   *     - application/json
   *     produces:
   *     - application/json
   *     responses:
   *       200:
   *         description: Get users successful
   *         schema:
   *            type: array
   *            items:
   *                $ref: "#/definitions/UserResponse"
   *       401:
   *         description: Token is invalid
   *         schema:
   *            $ref: "#/definitions/ErrorResponse"
   */

  /**
  * @swagger
  * /shawime/usuarios:
  *   delete:
  *     tags:
  *     - users
  *     summary: Delete user 👻
  *     description: Exclusão de usuário
  *     consumes:
  *     - application/json
  *     produces:
  *     - application/json
  *     parameters:
  *     - in: Param
  *       name: Param
  *       description: Update user object
  *       required: true
  *       schema:
  *         $ref: "id"
  *     responses:
  *       201:
  *         description: Updated successful
  *       403:
  *         description: Sem acesso ao usuário
  *         schema:
  *            $ref: "#/definitions/ErrorResponse"
  *       422:
  *         description: Validate Error
  *         schema:
  *            $ref: "#/definitions/ValidateErrorResponse"
  *       500:
  *         description: Error
  *         schema:
  *            $ref: "#/definitions/ErrorResponse"
  */

  /**
* @swagger
* /shawime/usuarios:
*   put:
*     tags:
*     - users
*     summary: Update user 👻
*     description: Alteração de usuário
*     consumes:
*     - application/json
*     produces:
*     - application/json
*     parameters:
*     - in: body
*       name: body
*       description: Update user object
*       required: true
*       schema:
*         $ref: "#/definitions/CreateUser"
*     responses:
*       201:
*         description: Updated successful
*         schema:
*            $ref: "#/definitions/UserResponse"
*       403:
*         description: Sem acesso ao usuário
*         schema:
*            $ref: "#/definitions/ErrorResponse"
*       422:
*         description: Validate Error
*         schema:
*            $ref: "#/definitions/ValidateErrorResponse"
*       500:
*         description: Error
*         schema:
*            $ref: "#/definitions/ErrorResponse"
*/


  /**
   * @swagger
   * /shawime/usuarios:
   *   post:
   *     tags:
   *     - users
   *     summary: Create user 👻
   *     description: Give me the f**king your information to create
   *     consumes:
   *     - application/json
   *     produces:
   *     - application/json
   *     parameters:
   *     - in: body
   *       name: body
   *       description: Created user object
   *       required: true
   *       schema:
   *         $ref: "#/definitions/CreateUser"
   *     responses:
   *       201:
   *         description: Registered successful
   *         schema:
   *            $ref: "#/definitions/UserResponse"
   *       403:
   *         description: Username is existed
   *         schema:
   *            $ref: "#/definitions/ErrorResponse"
   *       422:
   *         description: Validate Error
   *         schema:
   *            $ref: "#/definitions/ValidateErrorResponse"
   *       500:
   *         description: Error
   *         schema:
   *            $ref: "#/definitions/ErrorResponse"
   */

}
