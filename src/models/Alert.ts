import { Schema, model, Document, Types } from 'mongoose';

export interface IAlert extends Document {
  _id: Types.ObjectId;
  message: string;
  recipients: Types.ObjectId[]; // Array of user IDs who received the alert
  sentBy: Types.ObjectId; // Admin who sent the alert
  alertType: 'broadcast' | 'individual'; // Type of alert
  status: 'pending' | 'sent' | 'failed';
  failedRecipients?: {
    userId: Types.ObjectId;
    phone: string;
    error: string;
  }[];
  successCount: number;
  failureCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>({
  message: {
    type: String,
    required: [true, 'Alert message is required'],
    trim: true,
    maxlength: [160, 'SMS message cannot exceed 160 characters']
  },
  recipients: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alertType: {
    type: String,
    enum: ['broadcast', 'individual'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  failedRecipients: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    phone: String,
    error: String
  }],
  successCount: {
    type: Number,
    default: 0
  },
  failureCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
alertSchema.index({ sentBy: 1, createdAt: -1 });
alertSchema.index({ recipients: 1 });

export default model<IAlert>('Alert', alertSchema);