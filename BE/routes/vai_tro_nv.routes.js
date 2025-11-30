import express from 'express';
var router = express.Router();
import vai_tro_nvController from '../controllers/vai_tro_nv.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.get('/', authMiddleware, vai_tro_nvController.getAll);
router.get('/:id', authMiddleware, vai_tro_nvController.getById);
router.post('/', authMiddleware, vai_tro_nvController.insert);
router.post('/login', vai_tro_nvController.login);
router.post('/loginUser', vai_tro_nvController.loginUser);
router.post("/loginAuth", vai_tro_nvController.loginAuth);
router.put('/:id',authMiddleware, vai_tro_nvController.update);
router.delete('/:id', authMiddleware, vai_tro_nvController.delete);

export default router;
