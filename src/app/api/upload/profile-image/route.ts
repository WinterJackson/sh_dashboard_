// // src/app/api/upload/profile-image/route.ts


// File: app/api/administrators/[adminId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { adminId: string } }
) {
    const token = await getToken({ req });
    if (!token || token.role !== Role.SUPER_ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adminId } = params;

    try {
        const admin = await prisma.user.findUnique({
            where: { userId: parseInt(adminId) },
            include: { hospital: true },
        });
        if (!admin) {
            return NextResponse.json(
                { error: "Administrator not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(admin, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch administrator details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}





// import { NextRequest, NextResponse } from "next/server";
// import { Writable } from "stream";
// import Busboy from "busboy";
// import fs from "fs";
// import path from "path";

// export const config = {
//     api: {
//         bodyParser: false, // Disable body parsing for `multipart/form-data`
//     },
// };

// const uploadDir = path.join(process.cwd(), "/public/uploads");
// fs.mkdirSync(uploadDir, { recursive: true });

// export async function POST(req: NextRequest) {
//     const busboy = new Busboy({
//         headers: {
//             "content-type": req.headers.get("content-type") || "",
//         },
//         limits: {
//             fileSize: 5 * 1024 * 1024, // 5MB limit
//         },
//     });

//     const fields: Record<string, any> = {};
//     let uploadedFilePath: string | null = null;

//     return new Promise((resolve, reject) => {
//         busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
//             const filePath = path.join(uploadDir, filename);
//             uploadedFilePath = `/uploads/${filename}`;

//             const writeStream = fs.createWriteStream(filePath);
//             file.pipe(writeStream);

//             file.on("limit", () => {
//                 fs.unlinkSync(filePath); // Delete the file if it exceeds the size limit
//                 reject(
//                     NextResponse.json(
//                         { error: "File size exceeds the 5MB limit" },
//                         { status: 400 }
//                     )
//                 );
//             });

//             file.on("end", () => {
//                 console.log(`Uploaded file: ${filename}`);
//             });

//             file.on("error", (err) => {
//                 console.error("File stream error:", err);
//                 reject(
//                     NextResponse.json(
//                         { error: "File upload failed" },
//                         { status: 500 }
//                     )
//                 );
//             });
//         });

//         busboy.on("field", (fieldname, val) => {
//             fields[fieldname] = val; // Collect additional form data
//         });

//         busboy.on("finish", async () => {
//             if (!uploadedFilePath) {
//                 reject(
//                     NextResponse.json(
//                         { error: "No file uploaded" },
//                         { status: 400 }
//                     )
//                 );
//             }

//             // Example of handling additional form data
//             const userId = fields.userId;

//             if (!userId) {
//                 reject(
//                     NextResponse.json(
//                         { error: "User ID is required" },
//                         { status: 400 }
//                     )
//                 );
//             }

//             try {
//                 // Save uploaded file URL to the user's profile in the database
//                 import prisma from "@/lib/prisma";
//                 await prisma.user.update({
//                     where: { userId },
//                     data: {
//                         profile: {
//                             update: {
//                                 imageUrl: uploadedFilePath,
//                             },
//                         },
//                     },
//                 });

//                 resolve(
//                     NextResponse.json({
//                         message: "File uploaded successfully",
//                         fileUrl: uploadedFilePath,
//                     })
//                 );
//             } catch (error) {
//                 console.error("Error updating database:", error);
//                 reject(
//                     NextResponse.json(
//                         { error: "Failed to save file information" },
//                         { status: 500 }
//                     )
//                 );
//             }
//         });

//         busboy.on("error", (err) => {
//             console.error("Busboy error:", err);
//             reject(
//                 NextResponse.json({ error: "File upload failed" }, { status: 500 })
//             );
//         });

//         req.body.pipeTo(new Writable({
//             write(chunk, encoding, callback) {
//                 busboy.write(chunk, encoding, callback);
//             },
//             final(callback) {
//                 busboy.end(callback);
//             },
//         }));
//     });
// }
