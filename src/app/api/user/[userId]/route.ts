// src/app/api/user/[userId]/route.ts

import { NextApiRequest, NextApiResponse } from "next";
const prisma = require("@/lib/prisma")

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userId = req.query.userId as string;

    // Assuming your user model includes username and role
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, role: true },
    });

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
}
