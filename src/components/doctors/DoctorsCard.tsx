"use client";
import React, { useState } from 'react'
import DoctorBio from './DoctorBio'
import Image from 'next/image';

type Props = {}

function DoctorsCard({}: Props) {
    const[showBio, setShowBio] = useState(false)
    
    const handleShowBio = () => {
        setShowBio(!showBio)
    }
  return (
    <div className='flex-1 min-w-[330px] max-w-[400px]'>
        <div className=' relative flex justify-center flex-1 min-w-[330px] max-w-[400px] gap-4 items-center border-2 border-bluelight rounded-xl p-6'>
            <p className="absolute top-2 left-2">Online</p>
            <div className="flex flex-col gap-4 items-center" onClick={handleShowBio}>
                <img src="/images/img-p3.png" alt="" className='rounded-full w-[100px] h-[100px] object-cover '/>
                <h1 className="font-bold text-xl">Dr Jane Gold</h1>
            </div>
            <div className="flex flex-col gap-3" >
                <h1 className="text-lg capitalize" onClick={handleShowBio}>Gynecologist</h1>
                <div className="flex flex-col gap-2" onClick={handleShowBio}>
                    <p className='text-gray-400 capitalize'>women&apos;s health</p>
                    <div className="flex gap-2">
<Image 
  src="/images/Star.svg" 
  alt="description" 
  width={300} 
  height={150} 
  layout="responsive" 
/>                        
<Image 
  src="/images/Star.svg" 
  alt="description" 
width={300} 
  height={150} 
  layout="responsive" 
/> 
<Image 
  src="/images/Star.svg" 
  alt="description" 
 width={300} 
  height={150} 
  layout="responsive" 
/> 
<Image 
  src="/images/Star.svg" 
  alt="description" 
width={300} 
  height={150} 
  layout="responsive" 
/> 
                    </div>
                </div>
            <button className="p-2 border-2 border-primary text-primary hover:bg-blue-300 hover:text-black hover:border-blue-300 font-semibold rounded-xl">Appoint Doctor</button>
            </div>
        </div>
        {showBio && (
            <DoctorBio cancel={handleShowBio}/>
        )}
    </div>
  )
}

export default DoctorsCard
