import mongoose, { Schema, Model } from 'mongoose';
import type { Transaction } from '@/types';

const TransactionSchema = new Schema<Transaction>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TransactionModel: Model<Transaction> =
  mongoose.models.Transaction || mongoose.model<Transaction>('Transaction', TransactionSchema);

export default TransactionModel;