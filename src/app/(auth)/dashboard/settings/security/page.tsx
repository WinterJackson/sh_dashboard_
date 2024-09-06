import Toggle from '@/components/settings/toggle button/Toogle'
import React from 'react'

type Props = {}

export default function SecuritySettingsPage({}: Props) {
  return (
    <div className='flex flex-col w-full h-full gap-4'>
        <div className="flex justify-between items-center gap-20">
            <p className='capitalize '>Edit your security preferences here</p>
            <div className="flex gap-5 items-center pr-7">
{/* save button  */}
                <button className="p-3 rounded-xl border-2 border-primary bg-primary hover:border-blue-400 hover:bg-blue-400 duration-400 px-7 text-white font-bold">Save Changes</button>
                <button className="p-3 rounded-xl border-2 border-black  hover:border-blue-400 hover:bg-blue-400 duration-400 hover:text-white px-7 font-bold">Cancel</button>
            </div>
        </div>
        <div className="flex flex-col gap-8">
            <h1 className="font-bold text-primary">Password And Security</h1>
            <div className="bg-white flex flex-col gap-5 p-5 shadow-lg rounded-xl">
                <div className="flex items-end">
                    <div className="flex flex-col gap-2 w-[50%]">
                        <h2 className="font-bold ">Two Factor Authentication 2-FA</h2>
                        <p className='capitalize'>Enable 2-FA for an added layer of security.</p>
                    </div>
                    <button className='flex'>
                        <Toggle/>
                    </button>
                </div>
                <div className="flex items-end">
                    <div className="flex flex-col gap-2 w-[50%]">
                        <h2 className="font-bold ">Automatically Log Out</h2>
                        <p className='capitalize'>Automatically Log Out after (30)Minutes of inactivity.</p>
                    </div>
                    <button className='flex'>
                        <Toggle/>
                    </button>
                </div>
                <div className="flex items-end">
                    <div className="flex flex-col gap-2 w-[50%]">
                        <h2 className="font-bold ">Password Change</h2>
                        <p className='capitalize'>Change your password.</p>
                    </div>
                    <button className="p-3 rounded-xl border-2 border-black  hover:border-blue-400 hover:bg-blue-400 duration-400 hover:text-white px-7 font-bold">Change Password</button>
                </div>
            </div>
        </div>
    </div>
  )
}