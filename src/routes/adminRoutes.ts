import express from 'express';
import {
  getDashboardStats,
  broadcastAlert,
  getAlerts,
  getAllFarmers,
  getAllVeterinarians
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';
import { deleteFarmer } from '../controllers/adminController';


const router = express.Router();

// Protect all routes - admin only
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Broadcast alert to farmers
router.post('/broadcast', broadcastAlert);

// Get alert history
router.get('/alerts', getAlerts);

// Get all farmers
router.get('/farmers', getAllFarmers);

// Get all veterinarians
router.get('/veterinarians', getAllVeterinarians);
router.delete('/farmers/:id', deleteFarmer);
export default router;