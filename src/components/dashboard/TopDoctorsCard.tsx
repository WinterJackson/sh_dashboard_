import React from 'react'

type Props = {}

function TopDoctorsCard({}: Props) {
  return (
    <div className='p-4 flex flex-col gap-4 bg-white rounded-xl w-full border border-bluelight'>
        <h1 className='text-lg capitalize'>Top doctors</h1>
        <div className="flex flex-col gap-3 w-full overflow-y-scroll  overflow-x-hidden ">
    {/* map */}
            <div className="flex gap-3 items-center">
                <img src="/images/img-p6.png" alt="" className='w-[50px] h-[50px] object-cover rounded-full ' />
                <div className="flex gap-10 items-center w-full justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-base capitalize">Dr John Doe</h1>
                        <p className='text-accent capitalize'>General Physician</p>
                    </div>
                    <div className="flex flex-col gap-2">
                    {/* Rating */}
                        <div className="flex gap-2">
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                        </div>
                        <p>250 ratings</p>
                    </div>
                </div>
            </div>
{/* test scroll */}
            <div className="flex gap-3 items-center">
                <img src="/images/img-p6.png" alt="" className='w-[50px] h-[50px] object-cover rounded-full ' />
                <div className="flex gap-10 items-center w-full justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-base capitalize">Dr John Doe</h1>
                        <p className='text-accent capitalize'>General Physician</p>
                    </div>
                    <div className="flex flex-col gap-2">
                    {/* Rating */}
                        <div className="flex gap-2">
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                        </div>
                        <p>250 ratings</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 items-center">
                <img src="/images/img-p6.png" alt="" className='w-[50px] h-[50px] object-cover rounded-full ' />
                <div className="flex gap-10 items-center w-full justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-base capitalize">Dr John Doe</h1>
                        <p className='text-accent capitalize'>General Physician</p>
                    </div>
                    <div className="flex flex-col gap-2">
                    {/* Rating */}
                        <div className="flex gap-2">
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                        </div>
                        <p>250 ratings</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 items-center">
                <img src="/images/img-p6.png" alt="" className='w-[50px] h-[50px] object-cover rounded-full ' />
                <div className="flex gap-10 items-center w-full justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-base capitalize">Dr John Doe</h1>
                        <p className='text-accent capitalize'>General Physician</p>
                    </div>
                    <div className="flex flex-col gap-2">
                    {/* Rating */}
                        <div className="flex gap-2">
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                        </div>
                        <p>250 ratings</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 items-center">
                <img src="/images/img-p6.png" alt="" className='w-[50px] h-[50px] object-cover rounded-full ' />
                <div className="flex gap-10 items-center w-full justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-base capitalize">Dr John Doe</h1>
                        <p className='text-accent capitalize'>General Physician</p>
                    </div>
                    <div className="flex flex-col gap-2">
                    {/* Rating */}
                        <div className="flex gap-2">
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                            <img src="/images/Star.svg" alt="" className='scale-150' />
                        </div>
                        <p>250 ratings</p>
                    </div>
                </div>
            </div>
           

        </div>
    </div>
  )
}

export default TopDoctorsCard