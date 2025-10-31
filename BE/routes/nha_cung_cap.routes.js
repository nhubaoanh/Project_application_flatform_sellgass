import express from 'express';
var router = express.Router();
import nha_cung_capController from '../controllers/nha_cung_cap.controller.js';

router.get('/', nha_cung_capController.getAll);
router.get('/:id', nha_cung_capController.getById);
router.post('/', nha_cung_capController.insert);
router.put('/:id', nha_cung_capController.update);
router.delete('/:id', nha_cung_capController.delete);

export default router;
