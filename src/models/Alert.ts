import { Schema, model, Document, Types } from 'mongoose';

export interface IAlert extends Document {
  _id: Types.ObjectId;
  message: string;
  recipients: Types.ObjectId[];
  sentBy?: Types.ObjectId; // Made optional
  alertType?: 'broadcast' | 'individual'; // Made optional
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
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  recipients: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false  // ← Optional
  },
  alertType: {
    type: String,
    enum: ['broadcast', 'individual'],
    required: false  // ← Optional
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