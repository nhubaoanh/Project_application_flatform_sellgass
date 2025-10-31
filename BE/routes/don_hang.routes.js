import express from 'express';
var router = express.Router();
import don_hangController from '../controllers/don_hang.controller.js';

router.get('/', don_hangController.getAll);
router.get('/:id', don_hangController.getById);
router.post('/', don_hangController.insert);
router.post('/create', don_hangController.insertorder);
router.post("/my-orders/:makh", don_hangController.getMyOrders);
router.put('/:id', don_hangController.update);
router.delete('/:id', don_hangController.delete);
router.post('/dashboarddata', don_hangController.getDashboardData);

export default router;
