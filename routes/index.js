import express from 'express';
const router = express.Router();
import homeController from '../controllers/home';
import userController from '../controllers/user';

/* GET index page. */
router.get('/', homeController.index);

/* GET Signup page. */
router.get('/signup', userController.getSignup);

/* POST Signup page. */
router.post('/signup', userController.postSignup);

/* GET Login page. */
router.get('/login', userController.getLogin);

/* POST Login page. */
router.post('/login', userController.postLogin);

export default router;
