import { Request, Response, NextFunction } from 'express';
import Livestock from '../models/Livestock';
import Appointment from '../models/Appointment';
import Alert from '../models/Alert';

// @desc    Get dashboard stats for farmer
// @route   GET /api/dashboard/farmer
// @access  Private (Farmer only)
export const getFarmerDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role !== 'farmer') {
      res.status(403).json({
        success: false,
        message: 'Only farmers can access this endpoint'
      });
      return;
    }

    const farmerId = req.user.id;

    // Get livestock stats
    const allLivestock = await Livestock.find({ farmerId });
    const livestockStats = allLivestock.reduce((acc: any, animal) => {
      acc.total++;
      acc[animal.type] = (acc[animal.type] || 0) + 1;
      if (animal.healthStatus === 'healthy') acc.healthy++;
      else if (['sick', 'under-treatment'].includes(animal.healthStatus)) acc.sick++;
      return acc;
    }, { total: 0, healthy: 0, sick: 0 });

    // Get appointments count (this week)
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const appointmentsThisWeek = await Appointment.countDocuments({
      farmerId,
      date: { $gte: today, $lte: weekFromNow },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get recent appointments
    const recentAppointments = await Appointment.find({ farmerId })
      .sort({ date: 1 })
      .limit(5);

    // Get alerts count (this could be expanded based on your alert logic)
    const pendingAlerts = await Alert.countDocuments({
      recipients: farmerId,
      status: 'sent'
    });

    res.json({
      success: true,
      data: {
        livestockStats,
        appointmentsThisWeek,
        recentAppointments,
        pendingAlerts
      }
    });
  } catch (error: any) {
    console.error('Get farmer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};