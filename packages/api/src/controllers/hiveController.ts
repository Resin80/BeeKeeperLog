import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllHives = async (req: Request, res: Response) => {
  try {
    const hives = await prisma.hive.findMany({
      include: { 
        apiary: true,
        inspections: true,
        harvests: true,
        treatments: true,
        feedings: true
      },
    });
    res.json(hives);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hives' });
  }
};

export const getHiveById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const hive = await prisma.hive.findUnique({
      where: { id },
      include: { 
        apiary: true,
        inspections: { orderBy: { date: 'desc' } },
        harvests: { orderBy: { date: 'desc' } },
        treatments: { orderBy: { date: 'desc' } }
      },
    });
    if (!hive) {
      return res.status(404).json({ error: 'Hive not found' });
    }
    res.json(hive);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hive' });
  }
};

export const createHive = async (req: Request, res: Response) => {
  const { name, type, installDate, apiaryId, notes, latitude, longitude, queenColor, imagePath } = req.body;
  try {
    const hive = await prisma.hive.create({
      data: { 
        name, 
        type, 
        installDate: new Date(installDate), 
        apiaryId, 
        notes,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        queenColor,
        imagePath
      },
    });
    res.status(201).json(hive);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create hive' });
  }
};

export const updateHive = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, type, installDate, status, apiaryId, notes, latitude, longitude, queenColor, imagePath } = req.body;
  try {
    const hive = await prisma.hive.update({
      where: { id },
      data: { 
        name, 
        type, 
        installDate: installDate ? new Date(installDate) : undefined, 
        status, 
        apiaryId, 
        notes,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        queenColor,
        imagePath
      },
    });
    res.json(hive);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hive' });
  }
};

export const deleteHive = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    // Check if it exists first to avoid Prisma error
    const hive = await prisma.hive.findUnique({ where: { id } });
    if (!hive) {
      return res.status(204).send(); // Already gone, success
    }
    await prisma.hive.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete hive error:', error);
    res.status(500).json({ error: 'Failed to delete hive' });
  }
};
