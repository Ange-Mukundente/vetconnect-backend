import { Router } from 'express';
import authRoutes from './authRoutes';
import appointmentRoutes from './appointmentRoutes';
import livestockRoutes from './livestockRoutes';
import veterinarianRoutes from './veterinarianRoutes';
import adminRoutes from './adminRoutes'; 
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/livestock', livestockRoutes);
router.use('/veterinarians', veterinarianRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes); 
export default router;