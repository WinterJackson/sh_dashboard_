// src/components/hospitals/ui/hospital-sidebar/EditHospitalDialog.tsx

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
import { Hospital } from "@/lib/definitions";
import { useUpdateHospital } from "@/hooks/useUpdateHospital";

const HospitalSchema = z.object({
    hospitalName: z.string().min(1, "Hospital name is required"),
    phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    streetAddress: z.string().optional(),
    county: z.string().optional(),
    subCounty: z.string().optional(),
    town: z.string().optional(),
});

type HospitalForm = z.infer<typeof HospitalSchema>;

interface EditHospitalDialogProps {
    hospital: Hospital;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export function EditHospitalDialog(props: EditHospitalDialogProps) {
    const { hospital, open, onOpen, onClose } = props;
    const { toast } = useToast();
    const updateHospital = useUpdateHospital();

    const form = useForm<HospitalForm>({
        resolver: zodResolver(HospitalSchema),
        defaultValues: {
            hospitalName: hospital.hospitalName || "",
            phone: hospital.phone || "",
            email: hospital.email || "",
            streetAddress: hospital.streetAddress || "",
            county: hospital.county || "",
            subCounty: hospital.subCounty || "",
            town: hospital.town || "",
        },
    });

    const handleFormSubmit = async (values: HospitalForm) => {
        try {
            await updateHospital.mutateAsync({
                hospitalId: hospital.hospitalId,
                data: values,
            });
            toast({ title: "Hospital information updated." });
            onClose();
        } catch (error) {
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
                    <DialogTitle className="mb-4">Edit Hospital Information</DialogTitle>
                    <DialogDescription>
                        Update hospital details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="hospitalName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hospital Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Hospital Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone" {...field} />
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
                        <FormField
                            control={form.control}
                            name="streetAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street Address</FormLabel>
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="county"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>County</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="County"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subCounty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sub-county</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Sub-county"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="town"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Town</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Town" {...field} />
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
