// src/components/hospitals/ui/hospital-profile/EditBedCapacityDialog.tsx
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
import { useUpdateBedCapacity } from "@/hooks/useUpdateBedCapacity";
import { BedCapacity } from "@/lib/definitions";

const BedCapacitySchema = z.object({
    totalInpatientBeds: z.number().min(0, "Must be 0 or greater"),
    generalInpatientBeds: z.number().min(0, "Must be 0 or greater"),
    cots: z.number().min(0, "Must be 0 or greater"),
    maternityBeds: z.number().min(0, "Must be 0 or greater"),
    emergencyCasualtyBeds: z.number().min(0, "Must be 0 or greater"),
    intensiveCareUnitBeds: z.number().min(0, "Must be 0 or greater"),
    highDependencyUnitBeds: z.number().min(0, "Must be 0 or greater"),
    isolationBeds: z.number().min(0, "Must be 0 or greater"),
    generalSurgicalTheatres: z
        .number()
        .min(0, "Must be 0 or greater")
        .optional(),
    maternitySurgicalTheatres: z
        .number()
        .min(0, "Must be 0 or greater")
        .optional(),
});

type BedCapacityForm = z.infer<typeof BedCapacitySchema>;

interface EditBedCapacityDialogProps {
    hospitalId: number;
    bedCapacity: BedCapacity;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export function EditBedCapacityDialog(props: EditBedCapacityDialogProps) {
    const { hospitalId, bedCapacity, open, onOpen, onClose } = props;
    const { toast } = useToast();
    const updateBedCapacity = useUpdateBedCapacity();

    const form = useForm<BedCapacityForm>({
        resolver: zodResolver(BedCapacitySchema),
        defaultValues: {
            totalInpatientBeds: bedCapacity.totalInpatientBeds,
            generalInpatientBeds: bedCapacity.generalInpatientBeds,
            cots: bedCapacity.cots,
            maternityBeds: bedCapacity.maternityBeds,
            emergencyCasualtyBeds: bedCapacity.emergencyCasualtyBeds,
            intensiveCareUnitBeds: bedCapacity.intensiveCareUnitBeds,
            highDependencyUnitBeds: bedCapacity.highDependencyUnitBeds,
            isolationBeds: bedCapacity.isolationBeds,
            generalSurgicalTheatres: bedCapacity.generalSurgicalTheatres || 0,
            maternitySurgicalTheatres:
                bedCapacity.maternitySurgicalTheatres || 0,
        },
    });

    const handleFormSubmit = async (values: BedCapacityForm) => {
        try {
            await updateBedCapacity.mutateAsync({
                hospitalId,
                bedCapacityId: bedCapacity.bedCapacityId,
                data: values,
            });
            toast({ title: "Bed capacity updated successfully." });
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
            <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="mb-4">Edit Bed Capacity</DialogTitle>
                    <DialogDescription>
                        Update bed capacity information for this hospital.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-4"
                    >
                        <div className="max-h-[60vh] overflow-y-auto scrollbar-custom space-y-4 p-2">
                        <FormField
                            control={form.control}
                            name="totalInpatientBeds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Inpatient Beds</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="generalInpatientBeds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        General Inpatient Beds
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cots"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cots</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maternityBeds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Maternity Beds</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="emergencyCasualtyBeds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Emergency Casualty Beds
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="intensiveCareUnitBeds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ICU Beds</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="highDependencyUnitBeds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>HDU Beds</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isolationBeds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Isolation Beds</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="generalSurgicalTheatres"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        General Surgical Theatres
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maternitySurgicalTheatres"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Maternity Surgical Theatres
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
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
