// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import dotenv from 'dotenv';
// import path from 'path';
// import User from '../src/models/User';

// // Load .env reliably
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// console.log('MONGODB_URI:', process.env.MONGODB_URI); // Check if loaded

// const createAdmin = async () => {
//   try {
//     const uri = process.env.MONGODB_URI;
//     if (!uri) throw new Error("MONGODB_URI is not defined");
//     await mongoose.connect(uri);
//     console.log('✅ Connected to MongoDB');

//     const existingAdmin = await User.findOne({ email: 'admin@vetconnect.com' });
//     if (existingAdmin) {
//       console.log('⚠️ Admin already exists');
//       process.exit(0);
//     }

//     const hashedPassword = await bcrypt.hash('Admin@123', 10);
//     await User.create({
//       name: 'System Administrator',
//       email: 'admin@vetconnect.com',
//       password: hashedPassword,
//       role: 'admin',
//       phone: '+250788000000'
//     });

//     console.log('✅ Admin user created!');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error creating admin:', err);
//     process.exit(1);
//   }
// };

// createAdmin();
