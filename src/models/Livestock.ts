import { Schema, model, Document, Types } from 'mongoose';

export interface ILivestock extends Document {
  farmerId: Types.ObjectId;
  name: string;
  type: 'Cattle' | 'Goat' | 'Sheep' | 'Pig' | 'Chicken' | 'Other';
  breed?: string;
  age?: string;
  weight?: string;
  healthStatus: 'healthy' | 'sick' | 'under-treatment' | 'recovering';
  lastCheckup: Date;
  notes?: string;
  tagNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const livestockSchema = new Schema<ILivestock>({
  farmerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Livestock name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Livestock type is required'],
    enum: ['Cattle', 'Goat', 'Sheep', 'Pig', 'Chicken', 'Other']
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: String,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  healthStatus: {
    type: String,
    enum: ['healthy', 'sick', 'under-treatment', 'recovering'],
    default: 'healthy'
  },
  lastCheckup: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  tagNumber: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

export default model<ILivestock>('Livestock', livestockSchema);