import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllFeedings = async (req: Request, res: Response) => {
  try {
    const feedings = await prisma.feeding.findMany({
      include: { hive: true },
      orderBy: { date: 'desc' }
    });
    res.json(feedings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedings' });
  }
};

export const createFeeding = async (req: Request, res: Response) => {
  const { hiveId, date, type, amount, notes } = req.body;
  try {
    const feeding = await prisma.feeding.create({
      data: {
        hiveId,
        date: date ? new Date(date) : new Date(),
        type,
        amount,
        notes
      }
    });
    res.status(201).json(feeding);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feeding' });
  }
};
