// src/components/form/SignUpForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/loading";
import { Role } from "@/lib/definitions";
import { useFetchAllHospitals } from "@/hooks/useFetchAllHospitals";
import { useToast } from "@/components/ui/use-toast";
import { HospitalCombobox } from "@/components/ui/hospital-combobox";

const FormSchema = z.object({
    username: z.string().min(1).max(100),
    email: z.string().min(1).email(),
    role: z.nativeEnum(Role),
    hospitalId: z
        .number()
        .nonnegative()
        .refine((val) => val > 0, {
            message: "Please select a hospital",
        }),
});

const SignUpForm = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { data: hospitals = [], isLoading: hospitalsLoading } =
        useFetchAllHospitals();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            email: "",
            role: Role.STAFF,
            hospitalId: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        try {
            const endpoint =
                values.role === Role.SUPER_ADMIN
                    ? "/api/auth/register/super_admin"
                    : values.role === Role.ADMIN
                    ? "/api/auth/register/admin"
                    : "/api/auth/register";

            const response = await fetch(`${process.env.API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    role: values.role,
                    hospitalId: Number(values.hospitalId),
                }),
            });

            if (response.ok) {
                toast({
                    title: "Registration Successful",
                    description:
                        "A password reset link has been sent to your email. Please check your inbox to set up your account password.",
                    duration: 20000,
                });
            } else {
                const errorData = await response.json();
                toast({
                    title: "Registration Failed",
                    description:
                        errorData.error ||
                        "Please check your information and try again.",
                    variant: "destructive",
                    duration: 10000,
                });
            }
        } catch (error) {
            toast({
                title: "Network Error",
                description:
                    "Could not connect to the server. Please check your internet connection.",
                variant: "destructive",
                duration: 10000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {isLoading && <LoadingSpinner />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white text-xs sm:text-sm">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            className="focus:outline outline-1 outline-primary rounded-[5px] text-xs sm:text-sm"
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
                                    <FormLabel className="text-white text-xs sm:text-sm">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john.doe@example.com"
                                            className="focus:outline outline-1 outline-primary rounded-[5px] text-xs sm:text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white text-xs sm:text-sm">
                                        Role
                                    </FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="flex h-10 p-2 w-full rounded-[5px] focus:outline outline-0 bg-background text-xs sm:text-sm"
                                        >
                                            {Object.values(Role)
                                                .filter(
                                                    (role) =>
                                                        role !==
                                                            Role.SUPER_ADMIN &&
                                                        role !== Role.ADMIN &&
                                                        role !== Role.PATIENT
                                                )
                                                .map((role) => (
                                                    <option
                                                        key={role}
                                                        value={role}
                                                    >
                                                        {role
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            role
                                                                .slice(1)
                                                                .toLowerCase()}
                                                    </option>
                                                ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="hospitalId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white text-xs sm:text-sm">
                                        Hospital
                                    </FormLabel>
                                    <FormControl>
                                        <HospitalCombobox
                                            hospitals={hospitals}
                                            isLoading={hospitalsLoading}
                                            selectedHospitalId={
                                                field.value ?? null
                                            }
                                            onSelectHospitalId={(id) => {
                                                if (id !== null) {
                                                    field.onChange(id);
                                                }
                                            }}
                                            className="w-full h-10 rounded-[5px] bg-background text-xs sm:text-sm"
                                            defaultLabel="Select a hospital"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        className="w-full text-white text-xs sm:text-sm mt-6 rounded-[5px]"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing up..." : "Sign up"}
                    </Button>
                </form>

                <div className="mx-auto my-4 flex w-full items-center justify-evenly text-white before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                    or
                </div>

                <p className="text-center text-white text-xs sm:text-sm mt-2">
                    If you already have an account, please&nbsp;
                    <Link
                        className="text-primary hover:underline"
                        href="/sign-in"
                    >
                        Sign in
                    </Link>
                </p>
            </Form>
        </div>
    );
};

export default SignUpForm;
