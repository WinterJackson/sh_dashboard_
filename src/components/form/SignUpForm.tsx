// src/components/form/SignUpForm.tsx

"use client";

import { useEffect, useState } from "react";
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

const FormSchema = z.object({
    username: z.string().min(1).max(100),
    email: z.string().min(1).email(),
    role: z.nativeEnum(Role),
    hospitalId: z.number().nonnegative(),
});

const SignUpForm = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: hospitals = [], isLoading: hospitalsLoading } =
        useFetchAllHospitals();
    console.log("Fetched hospitals:", hospitals, "Loading:", hospitalsLoading);

    const filteredHospitals = hospitals.filter((h) =>
        h.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            email: "",
            role: Role.STAFF,
            hospitalId: -1,
        },
    });

    useEffect(() => {
        if (!hospitalsLoading && hospitals.length > 0) {
            form.setValue("hospitalId", hospitals[0].hospitalId);
        }
    }, [hospitals, hospitalsLoading]);

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
                    duration: 20000, // 20 seconds
                });
            } else {
                const errorData = await response.json();
                console.error("Registration failed:", errorData);
                toast({
                    title: "Registration Failed",
                    description:
                        errorData.error ||
                        "Please check your information and try again.",
                    variant: "destructive",
                    duration: 10000, // 10 seconds
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast({
                title: "Network Error",
                description:
                    "Could not connect to the server. Please check your internet connection.",
                variant: "destructive",
                duration: 10000, // 10 seconds
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
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
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
                                    <FormLabel className="text-white">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john.doe@example.com"
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
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel className="text-white">
                                        Role
                                    </FormLabel>
                                    <FormControl className="h-10 rounded-[5px] text-sm">
                                        <select
                                            {...field}
                                            className="focus:outline outline-2 outline-primary "
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
                                <FormItem className="flex flex-col w-full">
                                    <FormLabel className="text-white">
                                        Hospital
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-2">
                                            {/* Search input for hospital list filtering */}
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Search hospital name..."
                                                className="px-3 py-1 border rounded-[5px] text-sm"
                                            />
                                            <select
                                                {...field}
                                                onChange={(e) => {
                                                    const selectedId = Number(
                                                        e.target.value
                                                    );
                                                    console.log(
                                                        "🏥 Selected hospitalId:",
                                                        selectedId
                                                    );
                                                    field.onChange(selectedId);
                                                }}
                                                className="p-2 focus:outline outline-2 outline-primary max-h-40 overflow-y-auto text-sm rounded-[5px]"
                                            >
                                                <option
                                                    value=""
                                                    disabled
                                                    className="text-gray-400 text-sm"
                                                >
                                                    Select a hospital
                                                </option>
                                                {filteredHospitals.map(
                                                    (hospital) => (
                                                        <option
                                                            key={
                                                                hospital.hospitalId
                                                            }
                                                            value={
                                                                hospital.hospitalId
                                                            }
                                                            className="text-sm"
                                                        >
                                                            <div className="">
                                                                {
                                                                    hospital.hospitalName
                                                                }
                                                            </div>
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        className="w-full text-white mt-6"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing up..." : "Sign up"}
                    </Button>
                </form>

                <div className="mx-auto my-4 flex w-full items-center justify-evenly text-white before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                    or
                </div>

                {/* <GoogleSignInButton>Sign up with Google</GoogleSignInButton> */}

                <p className="text-center text-sm text-white mt-2">
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
