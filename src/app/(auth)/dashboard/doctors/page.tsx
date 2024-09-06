"use client";

import DoctorsCard from '@/components/doctors/DoctorsCard';
import React, { useState } from 'react'

type Props = {}

export default function DoctorsPage({}: Props) {
    const [showFilterOptions, setShowFilterOptions] = useState(false)
  return (
    <div className='flex flex-col  h-[calc(100vh-150px)] p-5'>
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-5">
                <h1 className="font-bold ">Doctors</h1>
                <p className="capitalize">There are 50 doctors currently registered</p>
            </div>
            <div className="relative flex gap-4 items-center">
                <p className="font-semibold">Filter By</p>
                <button onClick={() => setShowFilterOptions(!showFilterOptions)}>
                    <img src="/images/Arrow - Right 2.svg" alt="" />
                </button>
                {showFilterOptions &&
                    <div className="absolute z-20 top-6 -right-4 flex flex-col gap-2 bg-white p-5 w-[200px] rounded-md shadow-lg" onMouseLeave={() => setShowFilterOptions(false)}>
                        <button className="flex justify-between items-center py-3 px-1 hover:bg-slate-200">
                            <p className='font-semibold'> Department</p>
                            <img src="/images/Arrow - Right 3.svg" alt="" />
                        </button>
                        <button className="flex justify-between items-center py-3 px-1 hover:bg-slate-200">
                            <p className='font-semibold'> Availability</p>
                            <img src="/images/Arrow - Right 3.svg" alt="" />
                        </button>
                        <button className="flex justify-between items-center py-3 px-1 hover:bg-slate-200">
                            <p className='font-semibold'> Date Joined</p>
                            <img src="/images/Arrow - Right 3.svg" alt="" />
                        </button>
                    </div>
                }
            </div>
        </div>
    {/* doctors list */}
        <div className="flex justify-center xl:justify-start gap-4 flex-wrap mt-6">
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
            <DoctorsCard/>
        </div>
    </div>
  )
}