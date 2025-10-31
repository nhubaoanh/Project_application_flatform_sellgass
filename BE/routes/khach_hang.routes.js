import express from 'express';
var router = express.Router();
import khach_hangController from '../controllers/khach_hang.controller.js';

router.get('/', khach_hangController.getAll);
router.get('/:id', khach_hangController.getById);
router.post('/', khach_hangController.insert);
router.put('/:id', khach_hangController.update);
router.delete('/:id', khach_hangController.delete);
router.post('/checkCustom', khach_hangController.checkCustom);

export default router;
