import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllTreatments = async (req: Request, res: Response) => {
  try {
    const treatments = await prisma.treatment.findMany({
      include: { hive: true },
      orderBy: { date: 'desc' }
    });
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch treatments' });
  }
};

export const createTreatment = async (req: Request, res: Response) => {
  const { hiveId, date, productUsed, quantity, notes } = req.body;
  try {
    const treatment = await prisma.treatment.create({
      data: {
        hiveId,
        date: date ? new Date(date) : new Date(),
        productUsed,
        quantity,
        notes
      }
    });
    res.status(201).json(treatment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create treatment' });
  }
};
