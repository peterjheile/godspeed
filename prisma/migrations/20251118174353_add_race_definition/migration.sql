-- CreateTable
CREATE TABLE "RaceDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RaceType" NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaceDefinition_pkey" PRIMARY KEY ("id")
);
