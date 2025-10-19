import { Router } from 'express';
import { AuthenticateController } from '../controllers/AuthenticateController';
import { RegisterController } from '../controllers/RegisterController';
import { MeuPerfilController } from '../controllers/MeuPerfilController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { authLimiter } from '../middlewares/rateLimiter';

const authRouter = Router();

const loginController = new AuthenticateController();
const registerController = new RegisterController();
const meuPerfilController = new MeuPerfilController();

authRouter.post('/login', authLimiter, loginController.handle);
authRouter.post('/register', authLimiter, registerController.handle);
authRouter.get('/me', ensureAuthenticated, meuPerfilController.handle);

export { authRouter };
