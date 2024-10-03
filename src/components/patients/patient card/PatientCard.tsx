import React from 'react'

type Props = {}

function PatientCard({}: Props) {
  return (
          <div className="flex gap-2 items-center bg-gray-50 border-2 border-gray-500 rounded-xl p-3 w-[300px] ">
            <div className="flex flex-col items-center gap-1 w-[35%]">
              <img src="/images/img-p2.png" alt="" className='w-[80px] h-[80px] rounded-full object-cover'/>
              <div className="flex flex-col items-center gap-1">
                <p className='font-semibold text-sm text-center capitalize'>John doetron ndungu</p>
                <p className="text-xs font-semibold text-gray-400">1047956283</p>
              </div>
            </div>
            <div className="flex flex-col gap-5 items-center w-[65%]">
              {/* top */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center ">
                  <p className="text-xs text-gray-400 font-semibold w-[40%]">Age</p>
                  <p className="text-sm w-[60%] ">51 Years Old</p>
                </div>
                <div className="flex items-center ">
                  <p className="text-xs text-gray-400 font-semibold w-[40%]">Gender</p>
                  <p className="text-sm w-[60%] capitalize">Female</p>
                </div>
                <div className="flex items-center ">
                  <p className="text-xs text-gray-400 font-semibold w-[40%]">Diagnosis</p>
                  <p className="text-sm w-[60%] capitalize">Heart disease</p>
                </div>
              </div>
              {/* bottom */}
              <div className="flex justify-around gap-3">
                <img src="/images/videocall.svg" alt="" />
                <img src="/images/message.svg" alt="" />
                <img src="/images/calender.svg" alt="" />
              </div>
            </div>
          </div>
  )
}

export default PatientCard