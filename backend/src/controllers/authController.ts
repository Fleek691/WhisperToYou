import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ message: 'Google credential is required' });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ message: 'Invalid Google payload' });
      return;
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await UserModel.findOne({ email });
    const isAdmin = process.env.ADMIN_EMAIL?.split(',').map(e => e.trim()).includes(email);

    if (!user) {
      user = await UserModel.create({
        googleId,
        email,
        name,
        avatar,
        role: isAdmin ? 'admin' : 'user'
      });
    } else if (isAdmin && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const secret = process.env.JWT_SECRET || 'whisper_to_you_super_secret_jwt';
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};

export const getMe = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};
