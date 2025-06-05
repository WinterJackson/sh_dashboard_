// src/components/patients/patient-sidebar/KinInfoDialog.tsx

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
import { Patient } from "@/lib/definitions";

// Zod schema for Next of Kin info
const KinInfoSchema = z.object({
    nextOfKinName: z.string().optional(),
    nextOfKinRelationship: z.string().optional(),
    nextOfKinHomeAddress: z.string().optional(),
    nextOfKinPhoneNo: z.string().optional(),
    nextOfKinEmail: z.string().email("Invalid email address").optional(),
});

type KinInfoForm = z.infer<typeof KinInfoSchema>;

interface KinInfoDialogProps {
    patient: Patient;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSubmit: (data: KinInfoForm) => Promise<void>;
}

export function KinInfoDialog(props: KinInfoDialogProps) {
    const { patient, open, onOpen, onClose, onSubmit } = props;
    const { toast } = useToast();
    const form = useForm<KinInfoForm>({
        resolver: zodResolver(KinInfoSchema),
        defaultValues: {
            nextOfKinName: patient.nextOfKinName || "",
            nextOfKinRelationship: patient.nextOfKinRelationship || "",
            nextOfKinHomeAddress: patient.nextOfKinHomeAddress || "",
            nextOfKinPhoneNo: patient.nextOfKinPhoneNo || "",
            nextOfKinEmail: patient.nextOfKinEmail || "",
        },
    });

    const handleFormSubmit = async (values: KinInfoForm) => {
        try {
            await onSubmit(values);
            toast({ title: "Next of kin information updated." });
            onClose();
        } catch {
            toast({ title: "Update failed.", variant: "destructive" });
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
                    <DialogTitle>Edit Next of Kin Information</DialogTitle>
                    <DialogDescription>
                        Update patient’s next of kin details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="nextOfKinName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nextOfKinRelationship"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relationship</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Relationship"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nextOfKinHomeAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Home Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Home Address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nextOfKinPhoneNo"
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
                            name="nextOfKinEmail"
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
