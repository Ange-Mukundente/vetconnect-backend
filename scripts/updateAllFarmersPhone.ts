import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';  // ← Note the path change

dotenv.config();

const updateAllFarmersPhone = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connected to MongoDB\n');

    // Get all farmers BEFORE update
    const farmersBefore = await User.find({ role: 'farmer' });
    
    console.log(`📊 Found ${farmersBefore.length} farmers in database\n`);
    console.log('Farmers BEFORE update:');
    console.log('='.repeat(60));
    farmersBefore.forEach((farmer, index) => {
      console.log(`${index + 1}. ${farmer.name}`);
      console.log(`   Email: ${farmer.email}`);
      console.log(`   Phone: ${farmer.phone || 'No phone'}`);
      console.log('');
    });

    if (farmersBefore.length === 0) {
      console.log('❌ No farmers found in database!');
      process.exit(1);
      return;
    }

    console.log('='.repeat(60));
    console.log('🔄 Updating ALL farmers with phone: +250786160692');
    console.log('='.repeat(60) + '\n');

    // Update ALL farmers
    const result = await User.updateMany(
      { role: 'farmer' },
      { $set: { phone: '+250786160692' } }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} farmers!\n`);

    // Get all farmers AFTER update
    const farmersAfter = await User.find({ role: 'farmer' }).select('name email phone');
    
    console.log('Farmers AFTER update:');
    console.log('='.repeat(60));
    farmersAfter.forEach((farmer, index) => {
      console.log(`${index + 1}. ${farmer.name}`);
      console.log(`   Email: ${farmer.email}`);
      console.log(`   Phone: ${farmer.phone}`);
      console.log('');
    });

    console.log('='.repeat(60));
    console.log('✅ ALL DONE! All farmers now have your phone number.');
    console.log('📱 You will receive SMS for each farmer when admin sends alerts.');
    console.log('='.repeat(60) + '\n');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateAllFarmersPhone();