const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lead = await prisma.lead.findFirst();
  const service = await prisma.service.findFirst();
  
  console.log('Lead ID:', lead?.id);
  console.log('Service ID:', service?.id);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
