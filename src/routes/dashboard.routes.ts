import { Router } from 'express';
import { getFarmerDashboard } from '../controllers/dashboardController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication
router.use(protect);

// @route   GET /api/dashboard/farmer
// @desc    Get farmer dashboard stats
// @access  Private (Farmer only)
router.get('/farmer', authorize('farmer'), getFarmerDashboard);

export default router;