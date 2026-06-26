const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isActive: true
    }
  });
  console.log('Connected successfully! Users count:', users.length);
  for (const user of users) {
    let expectedPass = user.role === 'ADMIN' ? 'Admin@123!' : 'Agent@123!';
    const match = await bcrypt.compare(expectedPass, user.password);
    console.log(`User: ${user.email}, Password verification against "${expectedPass}": ${match ? 'MATCH ✅' : 'FAIL ❌'}`);
  }
}

main()
  .catch(e => console.error('Database error:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
