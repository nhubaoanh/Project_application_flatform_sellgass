import express from 'express';
var router = express.Router();
import san_phamController from '../controllers/san_pham.controller.js';

router.get('/', san_phamController.getAll);
router.get('/:id', san_phamController.getById);
router.post('/', san_phamController.insert);
router.put('/:id', san_phamController.update);
router.delete('/:id', san_phamController.delete);
router.post('/noibat', san_phamController.getNoiBat);

export default router;
