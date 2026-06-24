const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all leads and related data...');
  // Delete dependent data first to avoid foreign key constraints
  await prisma.itinerary.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.followUp.deleteMany({});
  await prisma.note.deleteMany({});
  
  // Finally delete leads
  const deleted = await prisma.lead.deleteMany({});
  console.log(`Successfully deleted ${deleted.count} leads and all associated data.`);
}

main()
  .catch(e => {
    console.error('Error deleting leads:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
