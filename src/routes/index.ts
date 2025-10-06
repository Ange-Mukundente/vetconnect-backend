import { Router } from 'express';
import authRoutes from './authRoutes';
import appointmentRoutes from './appointmentRoutes';
import livestockRoutes from './livestockRoutes';
import veterinarianRoutes from './veterinarianRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/livestock', livestockRoutes);
router.use('/veterinarians', veterinarianRoutes);

export default router;