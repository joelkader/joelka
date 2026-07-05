import { PrismaClient, UnitSize, UnitStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.accessLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.container.deleteMany();
  await prisma.waitlistEntry.deleteMany();

  // Create 3 initial containers
  const containers = await Promise.all([
    prisma.container.create({
      data: {
        serialNumber: "CONT-001",
        sizeFt: 40,
        locationOnSite: "Row A, Slot 1",
        purchaseCost: 4200,
        purchaseDate: new Date("2026-01-15"),
        condition: "good",
      },
    }),
    prisma.container.create({
      data: {
        serialNumber: "CONT-002",
        sizeFt: 40,
        locationOnSite: "Row A, Slot 2",
        purchaseCost: 4200,
        purchaseDate: new Date("2026-01-15"),
        condition: "good",
      },
    }),
    prisma.container.create({
      data: {
        serialNumber: "CONT-003",
        sizeFt: 40,
        locationOnSite: "Row B, Slot 1",
        purchaseCost: 4500,
        purchaseDate: new Date("2026-02-01"),
        condition: "good",
      },
    }),
  ]);

  // Create units — 3 per container (mix of sizes)
  const unitConfigs = [
    // Container 1: 2 quarter + 1 half
    { container: 0, number: "A-01", size: UnitSize.QUARTER, rate: 95, electricity: false },
    { container: 0, number: "A-02", size: UnitSize.QUARTER, rate: 95, electricity: false },
    { container: 0, number: "A-03", size: UnitSize.HALF, rate: 170, electricity: true, premium: 35 },
    // Container 2: 1 quarter + 1 half + occupancy demo
    { container: 1, number: "B-01", size: UnitSize.QUARTER, rate: 95, electricity: false },
    { container: 1, number: "B-02", size: UnitSize.HALF, rate: 170, electricity: false },
    { container: 1, number: "B-03", size: UnitSize.QUARTER, rate: 100, electricity: true, premium: 35 },
    // Container 3: 2 half + 1 full (larger units)
    { container: 2, number: "C-01", size: UnitSize.HALF, rate: 175, electricity: false },
    { container: 2, number: "C-02", size: UnitSize.HALF, rate: 175, electricity: true, premium: 40 },
    { container: 2, number: "C-03", size: UnitSize.FULL, rate: 310, electricity: true, premium: 50 },
  ];

  for (const cfg of unitConfigs) {
    await prisma.unit.create({
      data: {
        unitNumber: cfg.number,
        containerId: containers[cfg.container].id,
        size: cfg.size,
        monthlyRate: cfg.rate,
        hasElectricity: cfg.electricity,
        premiumAmount: cfg.premium ?? 0,
        status: UnitStatus.AVAILABLE,
      },
    });
  }

  console.log(`Seeded ${containers.length} containers and ${unitConfigs.length} units.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
