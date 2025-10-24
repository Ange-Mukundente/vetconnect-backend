import { Schema, model, Document, Types } from 'mongoose';

export interface IAppointment extends Document {
  farmerId: Types.ObjectId;
  farmerName: string;
  farmerPhone: string;
  vetId: Types.ObjectId;
  vetName: string;
  vetSpecialty?: string;
  vetPhone?: string;
  vetEmail?: string;
  livestockId: Types.ObjectId;
  livestockName: string;
  livestockType: string;
  date: Date;
  time: string;
  reason: 'routine-checkup' | 'vaccination' | 'illness' | 'injury' | 'pregnancy' | 'other';
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  location: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  farmerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: {
    type: String,
    required: true
  },
  farmerPhone: {
    type: String,
    required: true
  },
  vetId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vetName: {
    type: String,
    required: true
  },
  vetSpecialty: String,
  vetPhone: String,
  vetEmail: String,
  livestockId: {
    type: Schema.Types.ObjectId,
    ref: 'Livestock',
    required: true
  },
  livestockName: {
    type: String,
    required: true
  },
  livestockType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason for visit is required'],
    enum: ['routine-checkup', 'vaccination', 'illness', 'injury', 'pregnancy', 'other']
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  location: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    trim: true
  },
  treatment: {
    type: String,
    trim: true
  },
  medications: [{
    type: String
  }],
  followUpDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default model<IAppointment>('Appointment', appointmentSchema);