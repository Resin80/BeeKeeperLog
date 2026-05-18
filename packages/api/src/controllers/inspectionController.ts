import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllInspections = async (req: Request, res: Response) => {
  try {
    const inspections = await prisma.inspection.findMany({
      include: { hive: true },
      orderBy: { date: 'desc' }
    });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inspections' });
  }
};

export const createInspection = async (req: Request, res: Response) => {
  const { 
    hiveId, date, queenSeen, eggsPresent, broodPattern, 
    temperament, population, miteCount, diseaseSigns, notes, honeySupers, queenColor,
    framesOfBees, frameData, broodBoxes, framesOfFood, queenCellsFound, queenCellsAction,
    imagePath
  } = req.body;
  try {
    const inspection = await prisma.inspection.create({
      data: {
        hiveId,
        date: date ? new Date(date) : new Date(),
        queenSeen,
        queenColor,
        eggsPresent,
        broodPattern,
        temperament,
        population,
        queenCellsFound,
        queenCellsAction,
        broodBoxes: broodBoxes ? parseInt(broodBoxes) : 1,
        framesOfBees: framesOfBees ? parseInt(framesOfBees) : null,
        framesOfFood: framesOfFood ? parseInt(framesOfFood) : null,
        frameData,
        miteCount,
        diseaseSigns,
        imagePath,
        notes,
        honeySupers: honeySupers ? parseInt(honeySupers) : null
      }
    });

    // Update hive stats based on inspection
    const hiveUpdateData: any = {};
    if (honeySupers !== undefined) {
      hiveUpdateData.honeySupers = parseInt(honeySupers);
    }
    if (broodBoxes !== undefined) {
      hiveUpdateData.broodBoxes = parseInt(broodBoxes);
    }
    if (queenSeen && queenColor) {
      hiveUpdateData.queenColor = queenColor;
    }

    if (Object.keys(hiveUpdateData).length > 0) {
      await prisma.hive.update({
        where: { id: hiveId },
        data: hiveUpdateData
      });
    }

    res.status(201).json(inspection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inspection' });
  }
};

export const getInspectionById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: { hive: true }
    });
    if (!inspection) return res.status(404).json({ error: 'Inspection not found' });
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inspection' });
  }
};

export const updateInspection = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { 
    date, queenSeen, eggsPresent, broodPattern, 
    temperament, population, miteCount, diseaseSigns, notes, honeySupers, queenColor,
    framesOfBees, frameData, broodBoxes, queenCellsFound, queenCellsAction,
    imagePath
  } = req.body;
  try {
    const inspection = await prisma.inspection.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        queenSeen,
        queenColor,
        eggsPresent,
        broodPattern,
        temperament,
        population,
        queenCellsFound,
        queenCellsAction,
        broodBoxes: broodBoxes ? parseInt(broodBoxes) : undefined,
        framesOfBees: framesOfBees !== undefined ? parseInt(framesOfBees) : undefined,
        framesOfFood: req.body.framesOfFood !== undefined ? parseInt(req.body.framesOfFood) : undefined,
        frameData,
        miteCount,
        diseaseSigns,
        imagePath,
        notes,
        honeySupers: honeySupers !== undefined ? parseInt(honeySupers) : undefined
      }
    });

    // Optionally update hive stats if it's the latest inspection
    const hiveUpdateData: any = {};
    if (honeySupers !== undefined) hiveUpdateData.honeySupers = parseInt(honeySupers);
    if (broodBoxes !== undefined) hiveUpdateData.broodBoxes = parseInt(broodBoxes);
    if (queenSeen && queenColor) hiveUpdateData.queenColor = queenColor;

    if (Object.keys(hiveUpdateData).length > 0) {
      await prisma.hive.update({
        where: { id: inspection.hiveId },
        data: hiveUpdateData
      });
    }

    res.json(inspection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inspection' });
  }
};

export const deleteInspection = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.inspection.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inspection' });
  }
};
