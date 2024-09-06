"use client";
import React, { useState } from 'react'
import PercentageBar from './UI components/PercentageBar';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    cancel : () => void
}

function DoctorBio({cancel}: Props) {
    const [slide, setSlide] = useState("0")
    console.log(slide)
  return (
    <div className='absolute top-0  left-0 z-30 flex justify-center items-center lg:bg-[#7978780c]  h-full w-screen'>
        <div className=" relative flex flex-col gap-8 p-6 bg-white opacity-100 lg:w-fit rounded-2xl h-full lg:max-h-[800px] overflow-y-scroll w-full lg:max-w-[1000px]">
            <div className="absolute top-1 right-1" onClick={cancel}>
                <CloseIcon/>
            </div>
            <div className="flex gap-6 flex-wrap justify-center lg:justify-start">
        {/* profile bio */}
                <div className="flex flex-1 flex-col gap-7 items-center w-[500px]">
                    <div className="flex gap-5 items-center">
                        <img src="/images/img-p3.png" alt="" className='w-[150px] h-[150px] rounded-full object-cover'/>
                        <div className="flex flex-col gap-4">
                            <h1 className="font-semibold text-lg capitalize">Dr Jane Gold</h1>
                            <div className="flex flex-col gap-0 ">
                                <h1 className="text-lg capitalize">Gynecologist</h1>
                                <div className="flex flex-col gap-2">
                                    <div className="">
                                        <p className='text-gray-400 text-lg capitalize'>women&apos;s health</p>
                                        <p className='capitalize'>Joined Feb 2023</p>
                                    </div>
                                    <p className='capitalize text-sm text-primary'>Self-Registered </p>
                                </div>
                            </div>
                        </div>
                    </div>
            {/* sliding bio */}
                    <div className="flex flex-col gap-6 min-w-[360px] max-w-[400px]">
                        <div className="flex justify-between gap-2 min-w-[360px] max-w-[400px]">
                            <div className={`flex w-1/3 justify-center font-bold py-3 border-b-2 ${
                                slide==="0" ? "border-primary text-primary": " border-gray-400 text-gray-400 "
                            }`} onClick={() => setSlide("0")}>
                                <p>Biograghy</p>
                            </div>
                            <div className={`flex w-1/3 justify-center font-bold py-3 border-b-2 ${
                                slide==="400" ? "border-primary text-primary": " border-gray-400 text-gray-400 "
                            }`} onClick={() => setSlide("400")}>
                                <p>Skills</p>
                            </div>
                            <div className={`flex w-1/3 justify-center font-bold py-3 border-b-2 ${
                                slide==="800" ? "border-primary text-primary": " border-gray-400 text-gray-400 "
                            }`} onClick={() => setSlide("800")}>
                                <p className='text-nowrap'>Contact Information</p>
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className= {`flex gap-0 transition-transform duration-800 `} style={{
                                transform: `translateX(-${slide}px)`,
                                transition: 'transform 0.3s ease-in-out',
                            }}>
                                <div className='w-[400px] flex-shrink-0'>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam autem, tenetur ab obcaecati corporis iusto voluptatem architecto nobis eos dolores cum porro debitis, ipsum odit doloribus! Dolore odio quam error.</p>
                                </div>
                                <div className='w-[400px] flex-shrink-0'>
                                    <p className='font-bold capitalize'>Obstetrics</p>
                                    <p className='font-bold capitalize'>Gynecology</p>
                                    <p className='font-bold capitalize'>Reproductive Medicine</p>
                                </div>
                                <div className='w-[400px] flex-shrink-0'>
                                    <p className='flex gap-10'> <span className="font-bold text-primary">Email</span><span className="text-gray-400">janegold@example.com</span></p>
                                    <p className='flex gap-10'> <span className="font-bold text-primary">Phone Number</span><span className="text-gray-400">+234 556 667 238</span></p>
                                    <p className='flex gap-10'> <span className="font-bold text-primary">Address</span><span className="text-gray-400">Nairobi, Kenya </span></p>
                                    <p className='flex gap-10'> <span className="font-bold text-primary">LinkedIn</span><span className="text-gray-400">janegold@example.com</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        {/* patient reviews  */}
                <div className="flex flex-1 flex-col gap-5 min-w-[400px] max-w-[500px] items-center lg:items-start">
                    <h1 className="font-semibold">Patient Reviews</h1>
                    <div className="flex flex-col gap-2 w-full items-center lg:items-start">
                        <div className="flex justify-between gap-10 max-w-[400px] w-full bg-bluelight items-center p-3 rounded-2xl">
                            <div className="flex gap-2">
                                <img src="/images/Star.svg" alt="" className='scale-150'/>
                                <img src="/images/Star.svg" alt="" className='scale-150'/>
                                <img src="/images/Star.svg" alt="" className='scale-150'/>
                                <img src="/images/Star.svg" alt="" className='scale-150'/>
                                <img src="/images/Star.svg" alt="" className='scale-150'/>
                            </div>
                            <div className="">
                                <p>4.7 out of 5</p>
                            </div>
                        </div>
                        <p>40 patients rating</p>
                    </div>
                    <div className="flex flex-col max-w-[400px] gap-4 flex-1 w-full">
                        <div className="flex justify-between gap-2 items-center">
                            <h2 className="font-bold w-[50px]">5 star</h2>
                            <PercentageBar percentage="80%"/>
                            <span className="text-gray-500"> 80%</span>
                        </div>
                        <div className="flex justify-between gap-2 items-baseline">
                            <h2 className="font-bold w-[50px]">4 star</h2>
                            <PercentageBar percentage="10%"/>
                            <span className="text-gray-500"> 10%</span>
                        </div>
                        <div className="flex justify-between gap-2 items-baseline">
                            <h2 className="font-bold w-[50px]">3 star</h2>
                            <PercentageBar percentage="6%"/>
                            <span className="text-gray-500"> 6%</span>
                        </div>
                        <div className="flex justify-between gap-2 items-baseline">
                            <h2 className="font-bold w-[50px]">2 star</h2>
                            <PercentageBar percentage="4%"/>
                            <span className="text-gray-500"> 4%</span>
                        </div>
                        <div className="flex justify-between gap-2 items-baseline">
                            <h2 className="font-bold w-[50px]">1 star</h2>
                            <PercentageBar percentage="0%"/>
                            <span className="text-gray-500"> 0%</span>
                        </div>
                    </div>
                </div>
            </div>
        {/* licences  */}
            <div className='flex flex-col'>
                <h1 className="font-semibold mb-6">Licence</h1>
                <div className="flex flex-wrap gap-4  justify-center">
                    <div className="flex flex-1 gap-5 items-center max-w-[430px] min-w-[380px] border border-black p-4 rounded-xl">
                        <img src="/images/document.svg" alt="" />
                        <div className="flex flex-col gap-2  flex-1">
                            <h2 className="font-semibold capitalize">General Medical Practice Licence</h2>
                            <PercentageBar percentage={"25%"} />
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <h2>Expiry Date</h2>
                                    <span className="text-gray-400">21/2/23</span>
                                </div>
                                <button className='bg-primary text-white px-6 py-2 rounded-2xl'>View</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-5 items-center max-w-[430px] min-w-[380px] border border-black p-4 rounded-xl">
                        <img src="/images/document.svg" alt="" />
                        <div className="flex flex-col gap-2  flex-1">
                            <h2 className="font-semibold capitalize">General Medical Practice Licence</h2>
                            <PercentageBar percentage={"25%"} />
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <h2>Expiry Date</h2>
                                    <span className="text-gray-400">21/2/23</span>
                                </div>
                                <button className='bg-primary text-white px-6 py-2 rounded-2xl'>View</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-5 items-center max-w-[430px] min-w-[380px] border border-black p-4 rounded-xl">
                        <img src="/images/document.svg" alt="" />
                        <div className="flex flex-col gap-2  flex-1">
                            <h2 className="font-semibold capitalize">General Medical Practice Licence</h2>
                            <PercentageBar percentage={"25%"} />
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <h2>Expiry Date</h2>
                                    <span className="text-gray-400">21/2/23</span>
                                </div>
                                <button className='bg-primary text-white px-6 py-2 rounded-2xl'>View</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    </div>
  )
}

export default DoctorBio
