// src/lib/prisma.js file

const { PrismaClient } = require('@prisma/client');
const Sentry = require('@sentry/nextjs');

// Prevent multiple instances of Prisma Client in development
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
  });
};

const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Add middleware for error handling and logging
prisma.$use(async (params, next) => {
  const start = Date.now();
  try {
    const result = await next(params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Query ${params.model}.${params.action} took ${duration}ms`);
    }
    return result;
  } catch (error) {
    Sentry.captureException(error);
    console.error(`Prisma error in ${params.model}.${params.action}:`, error);
    throw error;
  }
});

// Add connection health check
setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error('Database connection health check failed:', error);
    Sentry.captureException(error);
    process.exit(1); // Exit process to trigger restart
  }
}, 60000); // Check every 60 seconds

module.exports = prisma;
