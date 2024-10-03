"use client";

import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "next/link";

type Props = {}

function AdminPatients({}: Props) {
    const [showOptions, setShowOptions] = useState(false);

    const options = () => {
        setShowOptions(!showOptions);
    };
  return (
    <div className="flex flex-col gap-4 p-3">
    <div className="flex gap-5 items-center px-3">
        <div className="flex gap-2 items-center font-semibold">
            <p>Filter By </p>
            <KeyboardArrowDownIcon />
        </div>
        <div className="">
            <p>Last Appointments</p>
        </div>
    </div>
    {/* table */}
    <table>
        <thead className="flex">
            <tr className="flex flex-1 text-gray-500 py-4">
                <th className=" relative flex justify-center  w-[30%]">
                    Basic Info
                    <p className="absolute left-0 text-primary ">
                        106 Patients
                    </p>
                </th>
                <th className="flex justify-center w-[15%]">
                    Phone Number
                </th>
                <th className="flex justify-center w-[15%]">Reg No</th>
                <th className="flex justify-center w-[15%]">
                    Last Appt{" "}
                </th>
                <th className="flex justify-center w-[15%]">
                    Next Appt
                </th>
                <th className="flex justify-start w-[10%] px-4">
                    Reason{" "}
                </th>
            </tr>
        </thead>
        <tbody className="flex flex-col gap-2">
            {/* map */}
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <Link
                    href={"/dashboard/patients/patient-profile"}
                    className="flex w-[30%]"
                >
                    <td className=" relative flex  gap-6">
                        <input type="checkbox" />
                        <div className="flex gap-2 items-center">
                            <Image
                                alt="profile pic"
                                src="/images/img-p4.png"
                                width="50"
                                height="50"
                                className="rounded-full object-cover"
                            />
                            <div className="flex flex-col gap-2">
                                <p className="font-semibold capitalize">
                                    {" "}
                                    patient name
                                </p>
                                <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                    {" "}
                                    patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                                </p>
                            </div>
                        </div>
                    </td>
                </Link>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3 relative">
                    <p>Maternity</p>
                    <button onClick={options}>
                        <MoreHorizIcon className="cursor-pointer" />
                    </button>
                    {showOptions && (
                        <div
                            className="absolute top-10 -right-4 flex flex-col  px-2 bg-white shadow"
                            onMouseLeave={() => setShowOptions(false)}
                        >
                            <div className="flex gap-2 items-center p-2 border-b hover:bg-slate-100">
                                <DriveFileRenameOutlineIcon />
                                <p>Edit</p>
                            </div>
                            <div className="flex gap-2 items-center p-2 hover:bg-slate-100">
                                <DeleteOutlineIcon />
                                <p className="text-nowrap">
                                    Delete Patient
                                </p>
                            </div>
                        </div>
                    )}
                </td>
            </tr>

            {/* test scroll */}

            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
            <tr className="flex flex-1 items-center bg-white shadow-md rounded p-4">
                <td className=" relative flex w-[30%] gap-6">
                    <input type="checkbox" />
                    <div className="flex gap-2 items-center">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold capitalize">
                                {" "}
                                patient name
                            </p>
                            <p className="text-sm text-primary truncate text-nowrap max-w-52">
                                {" "}
                                patient@gmail.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
                            </p>
                        </div>
                    </div>
                </td>
                <td className="flex justify-center  w-[15%]">
                    +234 345 344534
                </td>
                <td className="flex justify-center  w-[15%]">
                    KED123DFX
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-center  w-[15%] flex-col items-center">
                    <p>Jun 6, 2023</p> <p>2:30-3:30 A.M</p>{" "}
                </td>
                <td className="flex justify-between w-[10%] gap-3">
                    <p>Maternity</p>
                    <MoreHorizIcon className="cursor-pointer" />
                </td>
            </tr>
        </tbody>
    </table>
</div>
  )
}

export default AdminPatients