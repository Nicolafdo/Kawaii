const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const materials = await prisma.material.findMany();
  console.log('Total materials in DB:', materials.length);
  console.log(JSON.stringify(materials, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
