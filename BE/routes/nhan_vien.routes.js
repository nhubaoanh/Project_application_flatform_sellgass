import express from 'express';
var router = express.Router();
import nhan_vienController from '../controllers/nhan_vien.controller.js';

router.get('/', nhan_vienController.getAll);
router.get('/:id', nhan_vienController.getById);
router.post('/', nhan_vienController.insert);
router.put('/:id', nhan_vienController.update);
router.delete('/:manv', nhan_vienController.delete);

export default router;
