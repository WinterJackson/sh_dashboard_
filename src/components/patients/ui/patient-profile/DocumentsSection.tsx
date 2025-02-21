// src/components/patients/DocumentsSection.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function DocumentsSection({ patientId }: { patientId: number }) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setIsUploading(true);

            try {
                // Add your file upload logic here
                // const formData = new FormData();
                // newFiles.forEach(file => formData.append('files', file));
                // await uploadFiles(patientId, formData);

                setFiles((prev) => [...prev, ...newFiles]);
            } catch (error) {
                console.error("File upload failed:", error);
            }
            setIsUploading(false);
        }
    };

    const handleDeleteFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        // Add your delete API call here
    };

    return (
        <div className="bg-white p-4 rounded-[10px] shadow-md">
            <h2 className="text-base text-primary p-2 bg-bluelight/10 rounded-[10px] font-semibold mb-4">Files / Documents</h2>

            <div className="mb-4">
                <Input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    disabled={isUploading}
                    className="cursor-pointer"
                />
                <p className="p-2 pl-4 text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, JPG, PNG
                </p>
            </div>

            <div className="space-y-2">
                {files.map((file, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-black/5 rounded-[10px]"
                    >
                        <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(1)}KB
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteFile(index)}
                            className="bg-white border-2 hover:text-white"
                        >
                            <Trash2 className="h-5 w-5 hover:text-white text-red-600" />
                        </Button>
                    </div>
                ))}

                {files.length === 0 && (
                    <p className="text-gray-500 text-[15px] text-center py-4">
                        No documents uploaded yet
                    </p>
                )}
            </div>
        </div>
    );
}
