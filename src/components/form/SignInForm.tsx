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
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must have more than 8 characters"),
});

const SignInForm = () => {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        try {
            const response = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (!response?.error) {
                // Navigate to dashboard
                await router.replace("/dashboard?welcome=true");

            } else {
                console.error("Login failed:", response.error);
                toast({
                    title: "Sign in failed",
                    description: response.error,
                    variant: "destructive",
                    duration: 10000, // 10 seconds
                });
            }
        } catch (err) {
            console.error("An unexpected error occurred during sign-in:", err);
            toast({
                title: "Error occurred",
                description: "Failed to sign in. Please try again.",
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
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-2 top-2"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
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
                    <Link
                        className="text-primary hover:underline"
                        href="/sign-up"
                    >
                        Sign up
                    </Link>
                </p>
            </Form>
        </div>
    );
};

export default SignInForm;
