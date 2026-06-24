/**
 * Database Configuration
 * Prisma client singleton initialization with query logging.
 *
 * @module config/database
 */

const { PrismaClient } = require('@prisma/client');
const { env } = require('./env');

const prismaOptions = {
  log:
    env.NODE_ENV === 'development'
      ? [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'stdout' },
          { level: 'warn', emit: 'stdout' },
        ]
      : [{ level: 'error', emit: 'stdout' }],
};

/** @type {PrismaClient} Singleton Prisma client instance */
const prisma = new PrismaClient(prismaOptions);

/**
 * Connect to database and log query times in development.
 */
const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    if (env.NODE_ENV === 'development') {
      prisma.$on('query', (e) => {
        if (e.duration > 100) {
          console.warn(`⚠️ Slow query (${e.duration}ms): ${e.query}`);
        }
      });
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

/**
 * Gracefully disconnect from database.
 */
const disconnectDatabase = async () => {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
};

module.exports = { prisma, connectDatabase, disconnectDatabase };
