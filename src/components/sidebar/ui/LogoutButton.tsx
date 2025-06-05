// src/components/ui/LogoutButton.tsx

"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExitIcon } from "@radix-ui/react-icons";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../../ui/loading";

export default function LogoutButton() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        console.log("LogoutButton: initiating signOut()");
        setIsLoading(true);

        try {
            await signOut({
                callbackUrl: "/sign-in",
                redirect: true,
            });
            console.log("LogoutButton: signOut() returned");
            router.refresh();
        } catch (error) {
            console.error("LogoutButton: error during signOut()", error);
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div
                    className="flex max-w-[110px] py-1 px-2 bg-slate-100 items-center rounded-[10px] shadow-sm shadow-gray-400 gap-2 group hover:bg-primary cursor-pointer"
                    onClick={() => {
                        console.log(
                            "LogoutButton: opening confirmation drawer"
                        );
                        setOpen(true);
                    }}
                >
                    <ExitIcon className="text-primary group-hover:text-white" />
                    <span className="text-primary group-hover:text-white">
                        Log Out
                    </span>
                </div>
            </DrawerTrigger>

            <DrawerContent className="bg-slate-100 m-2 h-[30vh]">
                <div className="mx-auto my-auto w-full max-w-sm bg-secondary rounded-[10px] p-2">
                    <DrawerHeader>
                        <DrawerTitle className="text-white mb-4">
                            Confirm Log Out
                        </DrawerTitle>
                        <DrawerDescription className="text-white">
                            Are you sure you want to log out of your account?
                        </DrawerDescription>
                    </DrawerHeader>

                    <DrawerFooter className="flex-row gap-4">
                        <Button
                            variant="outline"
                            className="w-full bg-white"
                            onClick={() => {
                                console.log("LogoutButton: cancel logout");
                                setOpen(false);
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full bg-red-500 hover:bg-red-600"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <LoadingSpinner />
                                    Logging Out...
                                </div>
                            ) : (
                                "Log Out"
                            )}
                        </Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
