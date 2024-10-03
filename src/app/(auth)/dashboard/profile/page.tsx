"use client";

import EditPrefile from '@/components/profile/EditPrefile'
import Image from 'next/image'
import React, { useState } from 'react'

type Props = {}

function ProfilePage({}: Props) {
    const [showEditProfile, setShowEditProfile] = useState(false)

    const handleShowEdit = () => {
        setShowEditProfile(!showEditProfile)
    }
  return (
    <div className='flex flex-col gap-5 px-6 h-full overflow-y-scroll'>
        <h1 className="font-bold text-lg">Welcome Jane</h1>
        <div className="flex gap-8 h-full">
            <div className="flex flex-col gap-6 items-center w-[40%] bg-gray-200 rounded-2xl p-5">
                <div className="flex gap-8 items-center">
                    <Image 
                        src="/images/img-p3.png"
                        alt=""
                        width={180}
                        height={180}
                        className='rounded-full object-cover'
                    />
                    {/* <img src="/images/img-p3.png" className='w-[180px] h-[180px] rounded-full object-cover' alt="" /> */}
                    <div className="flex flex-col gap-3 ">
                        <h1 className="font-semibold text-xl capitalize">Dr Jane Gold</h1>
                        <p>
                            <span className="text-gray-500 text-sm capitalize">Gynecologist</span>
                        </p>
                        <p className="font-bold capitalize ">Women's health</p>
                        <div className="flex items-center gap2">
                            <img src="/images/Starblack.svg" alt="" />
                            <img src="/images/Starblack.svg" alt="" />
                            <img src="/images/Starblack.svg" alt="" />
                            <img src="/images/Starblack.svg" alt="" />
                            <img src="/images/Starblack.svg" alt="" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-5">
                        <h1 className="font-semibold">About</h1>
                        <p className="text-wrap">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi, vero maxime! Ipsa ipsum odio laudantium eaque assumenda voluptatibus, alias dolore molestias nam explicabo distinctio dolorem totam voluptates perferendis ipsam atque! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error veritatis a, dolor similique provident, non earum reprehenderit aliquid vero suscipit deserunt dolore, omnis quam doloribus nobis mollitia illo! Fugit, dolorum? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum atque ea consectetur quaerat repellat architecto deleniti placeat! Voluptatem, totam nisi fugit esse quo dicta qui aperiam reiciendis voluptas, libero delectus.</p>
                    </div>
                    <div className="flex flex-col gap-5">
                        <h1 className="font-semibold">Skills</h1>
                        <div className="flex gap-4 flex-wrap items-center">
                            <p className="p-3 bg-gray-300 capitalize rounded">Obstetrics</p>
                            <p className="p-3 bg-gray-300 capitalize rounded">Gynecology</p>
                            <p className="p-3 bg-gray-300 capitalize rounded">Reproductive</p>
                            <p className="p-3 bg-gray-300 capitalize rounded">Reproductive</p>
                            <p className="p-3 bg-gray-300 capitalize rounded">Reproductive</p>
                            <p className="p-3 bg-gray-300 capitalize rounded">Reproductive</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <h1 className="font-semibold">Contact Information</h1>
                        <div className="flex items-center gap-9 flex-wrap">
                            <div className="flex gap-4 items-center">
                            <Image
                                src="/images/email.svg"
                                alt=''
                                width={35}
                                height={35}
                            />
                            <p>janegold@yahoo.com</p>
                            </div>
                            <div className="flex gap-4 items-center">
                            <Image
                                src="/images/phone.svg"
                                alt=''
                                width={35}
                                height={35}
                            />
                            <p>+234 123 456 789</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-[60%] gap-8">
                <div className="flex gap-9 justify-between py-4 px-7 bg-gray-100 shadow-xl rounded-2xl min-h-[150px] flex-wrap ">
                    <div className="flex flex-col gap-5">
                        <p className='uppercase'>Account Balance </p>
                        <p className='uppercase text-sm flex items-center'>kes <span className="px-4 text-3xl"> 0.00</span></p>
                    </div>
                    <div className="flex flex-col justify-end">
                        <button className="bg-primary py-3 px-5 text-white rounded-xl"> View More</button>
                    </div>
                </div>
                <div className="flex gap-7 flex-wrap ">
                    <div className="flex flex-col h-[350px] flex-1 items-center max-w-[50%] min-w-[400px] rounded-2xl bg-slate-200 py-4 gap-6">
                        <h1 className='text-lg capitalize '>Refer friends - Earn Htc</h1>
                        <div className="flex flex-col gap-6 max-w-[370px] flex-1">
                            <p className="text-wrap">Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit suscipit minus odio dignissimos iusto asperiores autem enim perspiciatis explicabo perferendis </p>
                            <div className="flex flex-col flex-1 gap-6 p-5 bg-gray-100 rounded-2xl">
                                <p className='font-bold text-lg capitalize'> Referral code</p>  
                                <div className="flex gap-4 items-center">
                                    <p className='font-bold text-lg'> XN6757</p>
                                    <img src="/images/referralcode.svg" alt="" />
                                </div>  
                            </div>                           
                        </div>
                    </div>
                    <div className="flex flex-col h-[350px] flex-1 items-center max-w-[50%] min-w-[400px] rounded-2xl bg-slate-200 py-7 gap-6">
                        <h1 className='text-lg capitalize '>Manage Availability</h1>
                        <div className="flex flex-col gap-6 max-w-[370px] flex-1">
                            <p className="text-wrap">Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit suscipit minus odio dignissimos iusto asperiores autem enim perspiciatis explicabo perferendis </p>
                            <button className="py-4 px-8 bg-primary text-white font-semibold self-center w-max rounded-xl">
                                 Set Availabilty
                            </button>                           
                        </div>
                    </div>
                    <div className="flex flex-col h-[320px] flex-1 items-center max-w-[50%] min-w-[400px] rounded-2xl bg-slate-200 py-7 gap-6">
                        <h1 className='text-lg capitalize '>Edit Profile</h1>
                        <div className="flex flex-col gap-6 max-w-[370px] flex-1">
                            <p className="text-wrap">Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit suscipit minus odio dignissimos iusto asperiores autem enim perspiciatis explicabo perferendis </p>
                            <button className="py-4 px-8 bg-primary text-white font-semibold self-center w-max rounded-xl" onClick={handleShowEdit}>
                                Edit Profile
                            </button>
                            {showEditProfile && (
                                <EditPrefile close={handleShowEdit}/>
                            )}    
                        </div>
                    </div>
                    <div className="flex flex-col h-[320px] flex-1 items-center max-w-[50%] min-w-[400px] rounded-2xl bg-slate-200 py-7 gap-6">
                        <h1 className='text-lg capitalize '>Upload License</h1>
                        <div className="flex flex-col gap-6 max-w-[370px] flex-1">
                            <p className="text-wrap">Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit suscipit minus odio dignissimos iusto asperiores autem enim perspiciatis explicabo perferendis </p>
                            <button className="py-4 px-8 bg-primary text-white font-semibold self-center w-max rounded-xl">
                                Upload License
                            </button>                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default ProfilePage