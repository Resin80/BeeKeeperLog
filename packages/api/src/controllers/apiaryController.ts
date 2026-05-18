import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllApiaries = async (req: Request, res: Response) => {
  try {
    const apiaries = await prisma.apiary.findMany({
      include: { hives: true },
    });
    res.json(apiaries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch apiaries' });
  }
};

export const getApiaryById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const apiary = await prisma.apiary.findUnique({
      where: { id },
      include: { hives: true },
    });
    if (!apiary) {
      return res.status(404).json({ error: 'Apiary not found' });
    }
    res.json(apiary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch apiary' });
  }
};

export const createApiary = async (req: Request, res: Response) => {
  const { name, latitude, longitude, notes } = req.body;
  try {
    const apiary = await prisma.apiary.create({
      data: { name, latitude, longitude, notes },
    });
    res.status(201).json(apiary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create apiary' });
  }
};

export const updateApiary = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, latitude, longitude, notes } = req.body;
  try {
    const apiary = await prisma.apiary.update({
      where: { id },
      data: { name, latitude, longitude, notes },
    });
    res.json(apiary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update apiary' });
  }
};

export const deleteApiary = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const apiary = await prisma.apiary.findUnique({ where: { id } });
    if (!apiary) {
      return res.status(204).send();
    }
    await prisma.apiary.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete apiary error:', error);
    res.status(500).json({ error: 'Failed to delete apiary. Ensure it has no hives first.' });
  }
};
