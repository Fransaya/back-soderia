import { Router } from "express";

import {
    loginController,
    logoutController,
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    updatePasswordUserController
} from '../controllers/usuarioController.js';

const usuarioRoute = Router();

// login
usuarioRoute.post('/login', loginController);

// logout 
usuarioRoute.post('/logout', logoutController);

// get all users
usuarioRoute.get('/', getAllUsersController);

// get user by id
usuarioRoute.get('/:id', getUserByIdController);

// create new user
usuarioRoute.post('/', createUserController);

// update user by id
usuarioRoute.put('/:id', updateUserController);

// update password
usuarioRoute.put('/password/:id',updatePasswordUserController);

export default usuarioRoute;
