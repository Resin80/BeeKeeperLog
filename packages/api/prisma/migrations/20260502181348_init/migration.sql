-- CreateTable
CREATE TABLE "Apiary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Hive" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "installDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "notes" TEXT,
    "apiaryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Hive_apiaryId_fkey" FOREIGN KEY ("apiaryId") REFERENCES "Apiary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queenSeen" BOOLEAN NOT NULL DEFAULT false,
    "eggsPresent" BOOLEAN NOT NULL DEFAULT false,
    "broodPattern" TEXT NOT NULL,
    "temperament" TEXT NOT NULL,
    "population" TEXT NOT NULL,
    "miteCount" INTEGER,
    "diseaseSigns" TEXT,
    "notes" TEXT,
    "hiveId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inspection_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Harvest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" REAL NOT NULL,
    "productType" TEXT NOT NULL,
    "notes" TEXT,
    "hiveId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Harvest_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productUsed" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "notes" TEXT,
    "hiveId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Treatment_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
