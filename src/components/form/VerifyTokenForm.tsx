// src/components/form/VerifyTokenForm.tsx

"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface VerifyTokenFormProps {
    callbackUrl?: string;
}

const FormSchema = z.object({
    token: z
        .string()
        .length(6, "Token must be 6 digits")
        .regex(/^\d{6}$/, "Token must be numeric"),
});

type FormData = z.infer<typeof FormSchema>;

const MFAVerifyForm = ({
    callbackUrl = "/dashboard",
}: VerifyTokenFormProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: { token: "" },
    });

    const onSubmit = async (values: FormData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/mfa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: values.token }),
            });
            const result = await res.json();
            if (result.verified) {
                toast({
                    title: "Verified!",
                    description: "Redirecting...",
                });
                window.location.replace(callbackUrl);
            } else {
                toast({ title: "Invalid token", variant: "destructive" });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Verification failed.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-[20px] shadow-md"
                >
                    <FormField
                        control={form.control}
                        name="token"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">
                                    Verification Code
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter 6-digit code"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? "Verifying..." : "Verify Token"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default MFAVerifyForm;
