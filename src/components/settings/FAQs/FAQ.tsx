"use client";

import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

type Props = {}

function FAQ({}: Props) {
    const [isExtended, setIsExtended]= useState(false)
  return (
    <div className={`flex flex-col px-6 py-3 transition-transform duration-700 gap-7 ${
        isExtended ? "border border-bluelight rounded-2xl " : "border-b border-bluelight h-[50px] overflow-y-hidden"
    } `}>
        {/* Question */}
        <div className="flex justify-between items-center">
            <h1 className="font-bold capitalize max-w-[70%]">Are there any subscription fees?</h1>
            <button onClick={() => setIsExtended(!isExtended)} className='text-primary'>
                {isExtended? (
                    <RemoveIcon/>
                ):(
                    <AddIcon/>
                )}
            </button>
        </div>
        <p className='max-w-[70%]'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, voluptas corrupti? Iure ut modi itaque deserunt et excepturi velit incidunt dolores rerum, temporibus nulla consequatur eligendi, aliquid qui alias laudantium.</p>
    </div>
  )
}

export default FAQ