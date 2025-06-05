// src/components/patients/patient-sidebar/BasicInfoDialog.tsx

"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
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
import { Patient } from "@/lib/definitions";

// Zod schema for basic info
const BasicInfoSchema = z.object({
    maritalStatus: z.string().optional(),
    occupation: z.string().optional(),
    address: z.string().optional(),
    phoneNo: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
});

type BasicInfoForm = z.infer<typeof BasicInfoSchema>;

interface BasicInfoDialogProps {
    patient: Patient;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSubmitHandler: (data: BasicInfoForm) => Promise<void>;
}

export function BasicInfoDialog(props: BasicInfoDialogProps) {
    const { patient, open, onOpen, onClose, onSubmitHandler } = props;

    const { toast } = useToast();
    const form = useForm<BasicInfoForm>({
        resolver: zodResolver(BasicInfoSchema),
        defaultValues: {
            maritalStatus: patient.maritalStatus || "",
            occupation: patient.occupation || "",
            address: patient.user?.profile?.address || "",
            phoneNo: patient.user?.profile?.phoneNo || "",
            email: patient.user?.email || "",
        },
    });

    const handleFormSubmit = async (values: BasicInfoForm) => {
        try {
            await onSubmitHandler(values);
            toast({ title: "Basic information updated." });
            onClose();
        } catch (error) {
            toast({ title: "Update failed.", variant: "destructive" });
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Basic Information</DialogTitle>
                    <DialogDescription>
                        Update patient basic details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="maritalStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marital Status</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Marital Status"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="occupation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Occupation"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Home Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Phone No."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email"
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
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
