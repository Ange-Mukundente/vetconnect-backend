import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId; // Add this line
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'farmer' | 'veterinarian' | 'vet' | 'admin';
  
  // Farmer-specific fields
  district?: string;
  sector?: string;
  
  // Veterinarian-specific fields
  specialty?: string;
  licenseNumber?: string;
  location?: string;
  rating?: number;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: { 
    type: String,
    required: [true, 'Phone number is required']
  },
  role: {
    type: String,
    enum: ['farmer', 'veterinarian', 'vet', 'admin'],
    default: 'farmer',
    required: true
  },
  
  // Farmer-specific fields
  district: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'farmer';
    }
  },
  sector: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'farmer';
    }
  },
  
  // Veterinarian-specific fields
  specialty: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'veterinarian' || this.role === 'vet';
    }
  },
  licenseNumber: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'veterinarian' || this.role === 'vet';
    }
  },
  location: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'veterinarian' || this.role === 'vet';
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>('User', userSchema);