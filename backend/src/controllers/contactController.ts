import { Request, Response } from 'express';
import { ContactMessageModel } from '../models/ContactMessage.js';
import { inMemoryDB } from '../config/db.js';

export const submitContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: 'All contact form fields are required' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ message: 'Invalid email address' });
      return;
    }

    const contactData = {
      name,
      email,
      message,
      createdAt: new Date(),
    };

    try {
      const doc = new ContactMessageModel(contactData);
      await doc.save();
    } catch (e) {
      inMemoryDB.contactMessages.push({ ...contactData, _id: `c_${Date.now()}` });
    }

    res.status(201).json({ message: 'Message sent successfully. Thank you for contacting Ladup Sherpa.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
