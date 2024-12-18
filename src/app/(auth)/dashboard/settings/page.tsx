// src/app/(auth)/dashboard/settings/page.tsx

import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

type Props = {};

export default async function SettingsPage({}: Props) {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users to the sign-in page
    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const user = session?.user;

    return (
        <div className="flex flex-col w-full h-full ">
            <form className="flex flex-col gap-4 ">
                <div className="flex justify-between items-center gap-20">
                    <p className="capitalize ">
                        Update your profile picture and personal information
                        here
                    </p>
                    <div className="flex gap-5 items-center pr-7">
                        {/* save button  */}
                        <button className="p-3 rounded-xl border-2 border-primary bg-primary hover:border-blue-400 hover:bg-blue-400 duration-400 px-7 text-white font-bold">
                            Save Changes
                        </button>
                        <button className="p-3 rounded-xl border-2 border-black  hover:border-blue-400 hover:bg-blue-400 duration-400 hover:text-white px-7 font-bold">
                            Cancel
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <p className="font-bold text-primary">Profile Picture</p>
                    <div className="flex gap-5 items-center">
                        <Image
                            src="/images/profile placeholder.png"
                            alt="Profile placeholder"
                            width={144}
                            height={144}
                            className="object-cover rounded-full"
                        />{" "}
                        <div className="flex flex-col gap-3">
                            <p className="font-bold capitapize">John Doe</p>
                            <p className="capitalize">Admin</p>
                            <p className="truncate">johndoe@example.com</p>
                            <div className="flex gap-6 items-center">
                                <button className="p-2 rounded-xl border-2 border-primary bg-primary hover:border-blue-400 hover:bg-blue-400 duration-400 text-white font-bold">
                                    Upload New Photo
                                </button>
                                <button className="p-2 rounded-xl border-2 border-black  hover:border-blue-400 hover:bg-blue-400 duration-400 hover:text-white font-bold">
                                    Delete Photo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-10 ">
                    {/* bio */}
                    <div className="flex flex-col w-[40%] ">
                        <p className="font-bold text-primary pb-5">Bio</p>
                        <div className="flex flex-col gap-1 py-2 border-b">
                            <label htmlFor="surname">Surname</label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                className="bg-transparent outline-none"
                                placeholder="Enter Name"
                            />
                        </div>
                        <div className="flex flex-col gap-1 py-2 border-b">
                            <label htmlFor="firstname">First Name</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                className="bg-transparent outline-none"
                                placeholder="Enter Name"
                            />
                        </div>
                        <div className="flex flex-col gap-1 py-2 border-b">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                className="bg-transparent outline-none"
                            >
                                <option value="" disabled selected>
                                    Select Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    {/* contact information */}
                    <div className="flex flex-col w-[40%] ">
                        <p className="font-bold text-primary pb-5">
                            Contact Information
                        </p>
                        <div className="flex flex-col gap-1 py-2 border-b">
                            <label htmlFor="phonenumber">Phone Number</label>
                            <input
                                type="text"
                                id="phonenumber"
                                name="phonenumber"
                                className="bg-transparent outline-none"
                                placeholder="+254*********"
                            />
                        </div>
                        <div className="flex flex-col gap-1 py-2 border-b">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="bg-transparent outline-none"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="flex flex-col gap-1 py-2 border-b">
                            <label htmlFor="city">City</label>
                            <select
                                id="city"
                                name="city"
                                className="bg-transparent outline-none"
                            >
                                <option value="" disabled selected>
                                    Select City
                                </option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 py-2 border-b">
                            <label htmlFor="state">State</label>
                            <select
                                id="state"
                                name="state"
                                className="bg-transparent outline-none"
                            >
                                <option value="" disabled selected>
                                    Select State
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
