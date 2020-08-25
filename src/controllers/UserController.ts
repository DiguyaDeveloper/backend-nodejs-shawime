import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../model/User';

const crypto = require('crypto');
const mailer = require('../modules/mailer');

class UserController {

  public newUser = async (req: Request, res: Response): Promise<Response> => {
    console.log('cheguei aqui', req)
    const { fullname, email, username, password, state, country, help, acceptTerm} = req.body;
    
    const user = new User();
    user.fullname = fullname;
    user.password = password;
    user.email = email;
    user.username = username;
    user.state = state;
    user.country = country;
    user.help = help;
    user.acceptTerm = acceptTerm;

    const errors = await validate(user);
    

    if(!req['file']){
      return res.status(400).send( { error: 'Image upload is required', imageRequire: true} )
    }

    const { filename } = req['file'];

    if(filename.includes(' ')){
        return res.status(400).send( { error: 'Invalid image, please remove spaces for name', imageRequire: true} )
    }

    if (errors.length > 0) {
      res.status(400).send({ error: errors })
      return
    }

    user.hashPassword();

    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({ error: 'user email already in use' });
      return;
    }

    this.submit_account_code(user);
    
    user.password = undefined;
    res.status(201).json(user);
  };

  public editUser = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params['id']

    const { fullname, email, username, password, state, country, help, acceptTerm} = req.body;

    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ error: 'User not found' });
      return;
    }

    user.fullname = fullname;
    user.password = password;
    user.email = email;
    user.username = username;
    user.state = state;
    user.country = country;
    user.help = help;
    user.acceptTerm = acceptTerm;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ error: errors });
      return;
    }

    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({ error: 'error editing user ' + JSON.stringify(e) });
      return;
    }

    user.password = undefined;
    res.status(201).json(user);
  }

  public deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params['id'];

    const userRepository = getRepository(User);

    try {
      await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ error: 'User not found' });
      return;
    }
    userRepository.delete(id);

    res.status(201).send({ success: 'User deleted' });
  }

  public async submit_account_token(user){        
    try {
      const token = crypto.randomBytes(20).toString('hex');
      const userRepository = getRepository(User);

      try {
        await userRepository.save(user);
      } catch (e) {
        return;
      }

      mailer.sendMail({
        to: user.email,
        from: 'visitantesilvapc@gmail.com',
        template: './submit_account',
        context: { token, id: user._id},
        subject: "Shawime: Token account verification"
      }, (err) => {
        if (err){
          console.log(err);
        }
      });
    } catch (err){
      console.log(err);
    }
  };

  public async submit_account_code(user){        
    try {
      const code = Math.floor(100000 + Math.random() * 900000);
      const userRepository = getRepository(User);

      try {
        await userRepository.save(user);
      } catch (e) {
        return;
      }

      mailer.sendMail({
        to: user.email,
        from: 'visitantesilvapc@gmail.com',
        template: './submit_account_code',
        context: { code },
        subject: "Shawime: Token account verification"
      }, (err) => {
        if (err){
          console.log(err);
        }
      });
    } catch (err){
      console.log(err);
    }
  };

}


export default new UserController();
