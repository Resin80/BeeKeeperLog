import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an Apiary
  const apiary = await prisma.apiary.create({
    data: {
      name: 'Sunny Valley Apiary',
      latitude: 50.4501,
      longitude: -4.3541,
      notes: 'South-facing slope, good forage.',
    },
  });

  // Create some Hives
  const hive1 = await prisma.hive.create({
    data: {
      name: 'Hive Alpha',
      type: 'Langstroth',
      installDate: new Date('2025-04-10'),
      apiaryId: apiary.id,
      notes: 'Strong colony.',
    },
  });

  const hive2 = await prisma.hive.create({
    data: {
      name: 'Hive Beta',
      type: 'Top Bar',
      installDate: new Date('2025-05-15'),
      apiaryId: apiary.id,
      notes: 'Experimental hive.',
    },
  });

  // Create an Inspection
  await prisma.inspection.create({
    data: {
      hiveId: hive1.id,
      date: new Date('2026-04-20'),
      queenSeen: true,
      eggsPresent: true,
      broodPattern: 'Solid',
      temperament: 'Calm',
      population: 'High',
      notes: 'Looking great!',
    },
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
