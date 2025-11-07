import { Request, Response } from 'express';
import User from '../models/User';
import Alert from '../models/Alert';
import smsService from '../services/smsService';

/**
 * Get all farmers
 * GET /api/admin/farmers
 */
export const getAllFarmers = async (req: Request, res: Response) => {
  try {
    const farmers = await User.find({ role: 'farmer', isActive: true })
      .select('name email phone district sector createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (error: any) {
    console.error('Error fetching farmers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmers',
      error: error.message
    });
  }
};

/**
 * Send SMS alert to all farmers (Broadcast)
 * POST /api/admin/send-broadcast-alert
 */
export const sendBroadcastAlert = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const adminId = req.user?.id;

    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Alert message is required'
      });
    }

    if (message.length > 160) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 160 characters (SMS limit)'
      });
    }

    // Get all active farmers
    const farmers = await User.find({ 
      role: 'farmer', 
      isActive: true,
      phone: { $exists: true, $ne: '' }
    });

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active farmers found'
      });
    }

    // Extract phone numbers
    const phoneNumbers = farmers.map(farmer => farmer.phone);
    const farmerIds = farmers.map(farmer => farmer._id);

    // Send bulk SMS
    const smsResult = await smsService.sendBulkSMS(phoneNumbers, message);

    // Create alert record
    const alert = await Alert.create({
      message,
      recipients: farmerIds,
      sentBy: adminId,
      alertType: 'broadcast',
      status: smsResult.success ? 'sent' : 'failed',
      successCount: smsResult.recipients?.length || 0,
      failureCount: smsResult.failedRecipients?.length || 0,
      failedRecipients: smsResult.failedRecipients?.map(failed => {
        const farmer = farmers.find(f => f.phone === failed.phone);
        return {
          userId: farmer?._id,
          phone: failed.phone,
          error: failed.error
        };
      })
    });

    res.status(200).json({
      success: true,
      message: 'Broadcast alert sent',
      data: {
        alertId: alert._id,
        totalRecipients: farmers.length,
        successCount: alert.successCount,
        failureCount: alert.failureCount,
        smsResult: smsResult.message
      }
    });

  } catch (error: any) {
    console.error('Error sending broadcast alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send broadcast alert',
      error: error.message
    });
  }
};

/**
 * Send SMS alert to specific farmers
 * POST /api/admin/send-individual-alert
 */
export const sendIndividualAlert = async (req: Request, res: Response) => {
  try {
    const { message, farmerIds } = req.body;
    const adminId = req.user?.id;
    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Alert message is required'
      });
    }

    if (message.length > 160) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 160 characters (SMS limit)'
      });
    }

    if (!farmerIds || !Array.isArray(farmerIds) || farmerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one farmer ID is required'
      });
    }

    // Get selected farmers
    const farmers = await User.find({
      _id: { $in: farmerIds },
      role: 'farmer',
      isActive: true,
      phone: { $exists: true, $ne: '' }
    });

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No valid farmers found with the provided IDs'
      });
    }

    // Extract phone numbers
    const phoneNumbers = farmers.map(farmer => farmer.phone);

    // Send SMS
    const smsResult = await smsService.sendBulkSMS(phoneNumbers, message);

    // Create alert record
    const alert = await Alert.create({
      message,
      recipients: farmers.map(f => f._id),
      sentBy: adminId,
      alertType: 'individual',
      status: smsResult.success ? 'sent' : 'failed',
      successCount: smsResult.recipients?.length || 0,
      failureCount: smsResult.failedRecipients?.length || 0,
      failedRecipients: smsResult.failedRecipients?.map(failed => {
        const farmer = farmers.find(f => f.phone === failed.phone);
        return {
          userId: farmer?._id,
          phone: failed.phone,
          error: failed.error
        };
      })
    });

    res.status(200).json({
      success: true,
      message: 'Individual alerts sent',
      data: {
        alertId: alert._id,
        totalRecipients: farmers.length,
        successCount: alert.successCount,
        failureCount: alert.failureCount,
        smsResult: smsResult.message
      }
    });

  } catch (error: any) {
    console.error('Error sending individual alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send individual alert',
      error: error.message
    });
  }
};

/**
 * Get alert history
 * GET /api/admin/alert-history
 */
export const getAlertHistory = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const alerts = await Alert.find()
      .populate('sentBy', 'name email')
      .populate('recipients', 'name phone')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Alert.countDocuments();

    res.status(200).json({
      success: true,
      data: alerts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error: any) {
    console.error('Error fetching alert history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert history',
      error: error.message
    });
  }
};

/**
 * Get statistics
 * GET /api/admin/stats
 */
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer', isActive: true });
    const totalVets = await User.countDocuments({ 
      role: { $in: ['veterinarian', 'vet'] }, 
      isActive: true 
    });
    const totalAlerts = await Alert.countDocuments();
    
    const recentAlerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('sentBy', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalFarmers,
        totalVets,
        totalAlerts,
        recentAlerts
      }
    });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};