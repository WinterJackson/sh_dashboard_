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
// import GoogleSignInButton from "../GoogleSignInButton";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading";
import { Role } from "@/lib/definitions";

const FormSchema = z
    .object({
        username: z.string().min(1, "Username is required").max(100),
        email: z.string().min(1, "Email is required").email("Invalid email"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must have more than 8 characters"),
        confirmPassword: z.string().min(1, "Password confirmation is required"),
        role: z.nativeEnum(Role),
        hospitalId: z.number().nonnegative("Hospital is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

const SignUpForm = () => {
    const [hospitals, setHospitals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: Role.STAFF,
            hospitalId: -1,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            const hospitalsResponse = await fetch('/api/hospitals');
            const hospitalsData = await hospitalsResponse.json();
            setHospitals(hospitalsData);
        };

        fetchData();
    }, []);

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true);

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                role: values.role,
                hospitalId: Number(values.hospitalId),
            }),
        });

        setIsLoading(false);

        if (response.ok) {
            router.push('/sign-in');
        } else {
            console.error('Registration failed');
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm your password"
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
                                                        Role.SUPER_ADMIN
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
                                    <FormControl className="h-10 rounded-[5px] text-sm">
                                        <select
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="focus:outline outline-2 outline-primary "
                                        >
                                            <option
                                                value=""
                                                className="text-sm text-gray-400"
                                            >
                                                Select a hospital
                                            </option>
                                            {hospitals.map((hospital: any) => (
                                                <option
                                                    className="text-sm"
                                                    key={hospital.hospitalId}
                                                    value={hospital.hospitalId}
                                                >
                                                    {hospital.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button className="w-full text-white mt-6" type="submit">
                        Sign up
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
