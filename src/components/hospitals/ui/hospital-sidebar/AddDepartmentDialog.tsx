// src/components/hospitals/ui/hospital-sidebar/AddDepartmentDialog.tsx

"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddDepartment } from "@/hooks/useAddDepartment";
import { DepartmentType } from "@/lib/definitions";

const DepartmentSchema = z.object({
    name: z.string().min(1, "Department name is required"),
    type: z.nativeEnum(DepartmentType),
    description: z.string().optional(),
});

type DepartmentForm = z.infer<typeof DepartmentSchema>;

interface AddDepartmentDialogProps {
    hospitalId: number;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export function AddDepartmentDialog(props: AddDepartmentDialogProps) {
    const { hospitalId, open, onOpen, onClose } = props;
    const { toast } = useToast();
    const addDepartment = useAddDepartment();

    const form = useForm<DepartmentForm>({
        resolver: zodResolver(DepartmentSchema),
        defaultValues: {
            name: "",
            type: DepartmentType.CLINICAL,
            description: "",
        },
    });

    const handleFormSubmit = async (values: DepartmentForm) => {
        try {
            await addDepartment.mutateAsync({
                hospitalId,
                departmentData: values,
            });
            toast({ title: "Department added successfully." });
            onClose();
            form.reset();
        } catch (error) {
            toast({
                title: "Failed to add department.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (isOpen) onOpen();
                else onClose();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                    <DialogDescription>
                        Create a new department for this hospital.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Department Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department Type *</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="border rounded-md p-2 w-full"
                                        >
                                            {Object.values(DepartmentType).map(
                                                (type) => (
                                                    <option
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Add Department</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
