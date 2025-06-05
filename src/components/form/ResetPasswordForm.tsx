// src/components/form/ResetPasswordForm.tsx

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const FormSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must include an uppercase letter")
            .regex(/[a-z]/, "Must include a lowercase letter")
            .regex(/\d/, "Must include a number")
            .regex(/[@$!%*?&]/, "Must include a special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const ResetPasswordForm = () => {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const params = useParams();
    const token = Array.isArray(params.token) ? params.token[0] : params.token;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResend, setShowResend] = useState(false);
    const [resendEmail, setResendEmail] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleResend = async () => {
        try {
            const res = await fetch(
                `${process.env.API_URL}/api/auth/reset-password/resend`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: resendEmail }),
                }
            );

            if (res.ok) {
                toast({
                    title: "New reset link sent",
                    description:
                        "Check your email for the new password reset link.",
                });
            } else {
                const data = await res.json();
                toast({
                    title: "Resend failed",
                    description:
                        data.error ||
                        "Failed to send new reset link. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            toast({
                title: "Error occurred",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsSubmitting(true);

        try {
            const res = await fetch(
                `${process.env.API_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token,
                        newPassword: values.password,
                    }),
                }
            );

            if (res.ok) {
                toast({
                    title: "Password reset successful!",
                    description: "You can now sign in with your new password.",
                });
                setIsSuccess(true);
            } else {
                const data = await res.json();
                toast({
                    title: "Password reset failed",
                    description:
                        data.error ||
                        "Please check your request and try again.",
                    variant: "destructive",
                });
                if (data.error === "Invalid or expired token") {
                    setShowResend(true);
                }
            }
        } catch (error) {
            toast({
                title: "Network error",
                description:
                    "Could not connect to the server. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full max-w-sm"
            >
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">
                                New Password
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="New password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((s) => !s)
                                        }
                                        className="absolute top-2 right-2"
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

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">
                                Confirm Password
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Confirm password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirm((s) => !s)
                                        }
                                        className="absolute top-2 right-2"
                                    >
                                        {showConfirm ? (
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

                {showResend && (
                    <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={resendEmail}
                                onChange={(e) => setResendEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormMessage>
                            Invalid or expired token. Enter your email to resend
                            a fresh link.
                        </FormMessage>
                        <Button
                            variant="link"
                            onClick={handleResend}
                            disabled={!resendEmail}
                        >
                            Resend link
                        </Button>
                    </FormItem>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2"
                >
                    {isSubmitting ? "Setting..." : "Set/Reset Password"}
                </Button>

                {isSuccess && (
                    <p className="text-sm bg-white py-1 rounded-[5px] hover:bg-green-400 text-center mt-4 text-muted-foreground">
                        Ready to sign in?{" "}
                        <Link
                            href="/sign-in"
                            className="text-primary hover:underline font-medium"
                        >
                            Go to Sign In
                        </Link>
                    </p>
                )}
            </form>
        </Form>
    );
};

export default ResetPasswordForm;
