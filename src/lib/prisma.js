// src/lib/prisma.js file

const { PrismaClient } = require("@prisma/client");

let prisma;

try {
    if (process.env.NODE_ENV === "production") {
        prisma = new PrismaClient();
    } else {
        if (!global.prisma) {
            global.prisma = new PrismaClient();
        }
        prisma = global.prisma;
    }
} catch (error) {
    console.error("Error initializing Prisma Client:", error);
    process.exit(1); // Exit application on critical Prisma failure
}

module.exports = prisma;
