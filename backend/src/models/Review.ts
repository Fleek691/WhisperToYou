import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  customerName: string;
  email: string;
  rating: number;
  review: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);
