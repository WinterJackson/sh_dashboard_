// src/components/form/SignInForm.tsx

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
// import GoogleSignInButton from "../GoogleSignInButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading";

const FormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must have more than 8 characters"),
});

const SignInForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        const response = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        setIsLoading(false);

        if (!response?.error) {
            router.push("/dashboard");

        } else {
            console.error("Login failed:", response.error);
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="mail@example.com"
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
                                    <FormLabel className="text-white">Password</FormLabel>
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
                    </div>
                    <Button className="w-full text-white mt-6" type="submit">
                        Sign in
                    </Button>
                </form>
                <div className="mx-auto my-4 flex w-full items-center justify-evenly text-white before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                    or
                </div>
                {/* <GoogleSignInButton>Sign in with Google</GoogleSignInButton> */}
                <p className="text-center text-sm text-white mt-2">
                    If you don&apos;t have an account, please &nbsp;
                    <Link className="text-primary hover:underline" href="/sign-up">
                        Sign up
                    </Link>
                </p>
            </Form>
        </div>
    );
};

export default SignInForm;
