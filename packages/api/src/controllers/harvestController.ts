import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllHarvests = async (req: Request, res: Response) => {
  try {
    const harvests = await prisma.harvest.findMany({
      include: { hive: true },
      orderBy: { date: 'desc' }
    });
    res.json(harvests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch harvests' });
  }
};

export const createHarvest = async (req: Request, res: Response) => {
  const { hiveId, date, weight, productType, notes } = req.body;
  try {
    const harvest = await prisma.harvest.create({
      data: {
        hiveId,
        date: date ? new Date(date) : new Date(),
        weight: parseFloat(weight),
        productType,
        notes
      }
    });
    res.status(201).json(harvest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create harvest' });
  }
};
