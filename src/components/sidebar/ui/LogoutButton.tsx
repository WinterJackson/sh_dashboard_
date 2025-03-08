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

const LogoutButton = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl: "/sign-in" });
            router.replace("/sign-in");
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="flex max-w-[110px] py-1 px-2 bg-slate-100 items-center rounded-[10px] shadow-sm shadow-gray-400 gap-2 group hover:bg-primary cursor-pointer">
                    <ExitIcon className="text-primary group-hover:text-white" />
                    <span className="text-primary group-hover:text-white">
                        Log Out
                    </span>
                </div>
            </DrawerTrigger>

            <DrawerContent className="bg-slate-100 m-2 h-[30vh]">
                <div className="mx-auto my-auto w-full max-w-sm bg-bluelight rounded-[10px] p-2">
                    <DrawerHeader>
                        <DrawerTitle>Confirm Log Out</DrawerTitle>
                        <DrawerDescription>
                            Are you sure you want to log out of your account?
                        </DrawerDescription>
                    </DrawerHeader>

                    <DrawerFooter className="flex-row gap-4">
                        <Button
                            variant="outline"
                            className="w-full bg-white"
                            onClick={() => setOpen(false)}
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
};

export default LogoutButton;
