import { Router } from 'express';
import UserController from '../controllers/UserController';
import { checkJwt } from '../middlewares/checkJwt';

const multer = require('multer');
const uploadConfig = require('../config/upload');
const router = Router();
const upload = multer(uploadConfig);

router.post('/users', upload.single('picture'), UserController.newUser);

router.patch('/:id([0-9]+)', checkJwt, UserController.editUser);

router.delete('/:id([0-9]+)', checkJwt, UserController.deleteUser);

export default router;
