import { Request, Response } from 'express';
import User from '../models/User';
import Alert from '../models/Alert';
import { sendSMS } from '../services/twilioService';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalVeterinarians = await User.countDocuments({ 
      $or: [{ role: 'veterinarian' }, { role: 'vet' }] 
    });
    // Changed: Count ALL alerts, not just from this admin
    const totalAlerts = await Alert.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalFarmers,
        totalVeterinarians,
        totalAlerts,
      },
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard statistics',
    });
  }
};

// @desc    Broadcast alert to farmers via SMS
// @route   POST /api/admin/broadcast
// @access  Private/Admin
export const broadcastAlert = async (req: Request, res: Response) => {
  try {
    const { message, priority, targetType, selectedFarmerId, selectedDistrict, selectedSector } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('🚀 STARTING SMS BROADCAST');
    console.log('='.repeat(60));
    console.log(`📝 Message: ${message}`);
    console.log(`⚡ Priority: ${priority || 'medium'}`);
    console.log(`🎯 Target Type: ${targetType || 'all'}`);

    // Build query based on target type
    let query: any = {
      role: 'farmer',
      phone: { $exists: true, $nin: [null, ''] },
    };

    if (targetType === 'individual' && selectedFarmerId) {
      query._id = selectedFarmerId;
      console.log(`👤 Target: Individual farmer (${selectedFarmerId})`);
    } else if (targetType === 'district' && selectedDistrict) {
      query.district = selectedDistrict;
      console.log(`📍 Target: District (${selectedDistrict})`);
    } else if (targetType === 'sector' && selectedSector) {
      query.sector = selectedSector;
      console.log(`🗺️  Target: Sector (${selectedSector})`);
    } else {
      console.log(`🌍 Target: All Farmers`);
    }

    // Get farmers based on query
    const dbFarmers = await User.find(query).select('phone name email _id district sector');

    console.log(`📊 Found ${dbFarmers.length} farmers matching criteria`);

    if (dbFarmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No farmers found matching the criteria',
      });
    }

    console.log('\n📱 Recipients:');
    dbFarmers.forEach((farmer, index) => {
      console.log(`   ${index + 1}. ${farmer.name} (${farmer.phone}) - ${farmer.sector}, ${farmer.district}`);
    });

    console.log('\n' + '-'.repeat(60));
    console.log('📤 SENDING SMS...');
    console.log('-'.repeat(60) + '\n');

    // Send SMS
    let successCount = 0;
    let failureCount = 0;
    const results = [];
    const failedRecipients = [];

    for (const farmer of dbFarmers) {
      try {
        const smsMessage = `[VetConnect Alert]\n\n${message}\n\n- VetConnect Rwanda`;

        console.log(`▶️  ${farmer.name} (${farmer.phone})`);

        const result = await sendSMS(farmer.phone, smsMessage);

        if (result.success) {
          successCount++;
          results.push({
            farmer: farmer.name,
            phone: farmer.phone,
            status: 'success',
          });
          console.log(`   ✅ SUCCESS`);
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        failureCount++;
        results.push({
          farmer: farmer.name,
          phone: farmer.phone,
          status: 'failed',
          error: error.message,
        });
        failedRecipients.push({
          userId: farmer._id,
          phone: farmer.phone,
          error: error.message,
        });
        console.error(`   ❌ FAILED: ${error.message}`);
      }
    }

    // Save alert
    const alert = await Alert.create({
      message: message.substring(0, 500),
      recipients: dbFarmers.map((f) => f._id),
      sentBy: adminId,
      alertType: targetType === 'individual' ? 'individual' : 'broadcast',
      status: failureCount === 0 ? 'sent' : 'sent',
      successCount,
      failureCount,
      failedRecipients: failedRecipients.length > 0 ? failedRecipients : undefined,
    });

    console.log(`\n✅ Alert saved (ID: ${alert._id})`);
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPLETE');
    console.log('='.repeat(60));
    console.log(`Recipients: ${dbFarmers.length}`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log('='.repeat(60) + '\n');

    res.status(201).json({
      success: true,
      message: `Alert sent to ${successCount}/${dbFarmers.length} farmers`,
      data: {
        alertId: alert._id,
        totalFarmers: dbFarmers.length,
        successCount,
        failureCount,
        results,
      },
    });
  } catch (error: any) {
    console.error('\n❌ ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send alert',
    });
  }
};

// @desc    Get all alerts
// @route   GET /api/admin/alerts
// @access  Private/Admin
export const getAlerts = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    console.log('🔍 Fetching all alerts from database...');

    // CHANGED: Get ALL alerts, not filtered by sentBy
    const alerts = await Alert.find()
      .populate('sentBy', 'name email')
      .populate('recipients', 'name email phone district sector')
      .sort({ createdAt: -1 })
      .limit(100);

    console.log(`📊 Found ${alerts.length} total alerts in database`);

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error: any) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch alerts',
    });
  }
};

// @desc    Get all farmers
// @route   GET /api/admin/farmers
// @access  Private/Admin
export const getAllFarmers = async (req: Request, res: Response) => {
  try {
    const dbFarmers = await User.find({ role: 'farmer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dbFarmers.length,
      data: dbFarmers,
    });
  } catch (error: any) {
    console.error('Get farmers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch farmers',
    });
  }
};

// @desc    Delete a farmer
// @route   DELETE /api/admin/farmers/:id
// @access  Private/Admin
export const deleteFarmer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const farmer = await User.findById(id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    if (farmer.role !== 'farmer') {
      return res.status(400).json({
        success: false,
        message: 'This user is not a farmer'
      });
    }

    await User.findByIdAndDelete(id);

    console.log(`🗑️  Farmer deleted: ${farmer.name} (${id})`);

    res.status(200).json({
      success: true,
      message: 'Farmer deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete farmer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete farmer'
    });
  }
};

// @desc    Get all veterinarians
// @route   GET /api/admin/veterinarians
// @access  Private/Admin
export const getAllVeterinarians = async (req: Request, res: Response) => {
  try {
    const veterinarians = await User.find({ 
      $or: [{ role: 'veterinarian' }, { role: 'vet' }] 
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: veterinarians.length,
      data: veterinarians,
    });
  } catch (error: any) {
    console.error('Get veterinarians error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch veterinarians',
    });
  }
};