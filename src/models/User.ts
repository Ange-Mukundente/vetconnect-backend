import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId;
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
  
  // Farmer-specific fields (no required function - handled by pre-validate)
  district: {
    type: String
  },
  sector: {
    type: String
  },
  
  // Veterinarian-specific fields (no required function - handled by pre-validate)
  specialty: {
    type: String
  },
  licenseNumber: {
    type: String
  },
  location: {
    type: String
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

// Custom validation before save
userSchema.pre('validate', function(next) {
  // Validate farmer fields
  if (this.role === 'farmer') {
    if (!this.district) {
      this.invalidate('district', 'District is required for farmers');
    }
    if (!this.sector) {
      this.invalidate('sector', 'Sector is required for farmers');
    }
  }
  
  // Validate veterinarian/vet fields
  if (this.role === 'veterinarian' || this.role === 'vet') {
    if (!this.specialty) {
      this.invalidate('specialty', 'Specialty is required for veterinarians');
    }
    if (!this.licenseNumber) {
      this.invalidate('licenseNumber', 'License number is required for veterinarians');
    }
    if (!this.location) {
      this.invalidate('location', 'Location is required for veterinarians');
    }
  }
  
  next();
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