// src/app/api/upload/profile-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

const prisma = require("@/lib/prisma");

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "/public/uploads");

fs.mkdirSync(uploadDir, { recursive: true });

export async function POST(req: NextRequest) {
    const form = new IncomingForm({
        uploadDir: uploadDir,
        keepExtensions: true,
    });

    try {
        const data = await new Promise<{ fields: any; files: any }>(
            (resolve, reject) => {
                form.parse(req as any, (err, fields, files) => {
                    if (err) {
                        console.error("Error parsing files", err);
                        reject(new Error("File upload failed"));
                    }
                    resolve({ fields, files });
                });
            }
        );

        const { fields, files } = data;

        // `files.image` can be either a single file or an array
        const file = Array.isArray(files.image) ? files.image[0] : files.image;

        if (!file) {
            return NextResponse.json(
                { message: "No file uploaded" },
                { status: 400 }
            );
        }

        // Ensure `file.filepath` is used to get the file path
        const filePath = `/uploads/${path.basename(file.filepath)}`;

        const userId = fields.userId as string;

        // Update the user profile image URL in the database
        await prisma.user.update({
            where: { userId },
            data: {
                profile: {
                    update: {
                        imageUrl: filePath,
                    },
                },
            },
        });

        return NextResponse.json({
            message: "File uploaded successfully",
            fileUrl: filePath,
        });
    } catch (error) {
        console.error("Error handling file upload:", error);
        return NextResponse.json(
            { message: "File upload failed" },
            { status: 500 }
        );
    }
}
