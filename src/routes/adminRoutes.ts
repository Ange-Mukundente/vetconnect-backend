import { Router } from 'express';
import {
  getAllFarmers,
  sendBroadcastAlert,
  sendIndividualAlert,
  getAlertHistory,
  getAdminStats
} from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/roleMiddleware';

const router = Router();

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

// GET routes
router.get('/farmers', getAllFarmers);
router.get('/alert-history', getAlertHistory);
router.get('/stats', getAdminStats);

// POST routes
router.post('/send-broadcast-alert', sendBroadcastAlert);
router.post('/send-individual-alert', sendIndividualAlert);

export default router;