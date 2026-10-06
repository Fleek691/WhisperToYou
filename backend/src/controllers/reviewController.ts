import { Request, Response } from 'express';
import { ReviewModel } from '../models/Review.js';
import { inMemoryDB } from '../config/db.js';

export const getApprovedReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    let reviews = [];
    try {
      reviews = await ReviewModel.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (e) {}

    if (reviews.length === 0) {
      reviews = inMemoryDB.reviews
        .filter((r) => r.status === 'approved')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    }

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

export const submitReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, email, rating, review } = req.body;

    if (!customerName || !email || !review) {
      res.status(400).json({ message: 'All review fields are required' });
      return;
    }

    const newReview = {
      customerName,
      email,
      rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
      review,
      status: 'pending', // MUST require admin approval
      createdAt: new Date(),
    };

    try {
      const doc = new ReviewModel(newReview);
      await doc.save();
    } catch (e) {
      inMemoryDB.reviews.push({ ...newReview, _id: `rev_${Date.now()}` });
    }

    res.status(201).json({
      message: 'Thank you! Your review has been submitted for author approval.',
      review: newReview,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
};
