import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    close: () => void
}

export default function EditPrefile({close}: Props) {
  return (
    <div className='bg-[#0000006c] absolute top-0 left-0 w-full h-full flex flex-col justify-center z-30 items-center'>
        <div className= "relative bg-gray-100 h-[550px] flex flex-col gap-10 py-6 px-8 ">
            <h1 className="font-bold text-lg">Edit Profile</h1>
            <button className="absolute top-3 right-3 bg-slate-200 rounded p-2" onClick={close}>
                <CloseIcon/>
            </button>
            <form className="flex w-[100%] gap-10">
        {/* left */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap3">
                        <h1 className="text-sm font-semibold text-gray-500 pb-2">Bio</h1>
                        <div className="flex flex-col border-b border-gray-200 gap-1 py-2 min-w-[350px]">
                            <label htmlFor="surname" className='capitalize font-bold'>surname</label>
                            <input type="text" className='bg-transparent outline-none' id='surname' name='surname' placeholder='Enter Name' />
                        </div>
                        <div className="flex flex-col border-b border-gray-200 gap-1 py-2 min-w-[350px]">
                            <label htmlFor="firstname" className='capitalize font-bold'>first name</label>
                            <input type="text" className='bg-transparent outline-none' id='firstname' name='firstname' placeholder='Enter Name' />
                        </div>
                    </div>
                    <div className="flex flex-col gap3">
                        <h1 className="text-sm font-semibold text-gray-500 pb-2">Contact Information</h1>
                        <div className="flex flex-col border-b border-gray-200 gap-1 py-2 min-w-[350px]">
                            <label htmlFor="phonenumber" className='capitalize font-bold'>phone number</label>
                            <input type="text" className='bg-transparent outline-none' id='phonenumber' name='phonenumber' placeholder='+123 *********' />
                        </div>
                        <div className="flex flex-col border-b border-gray-200 gap-1 py-2 min-w-[350px]">
                            <label htmlFor="emailaddress" className='capitalize font-bold'>email address</label>
                            <input type="email" className='bg-transparent outline-none' id='emailaddress' name='emailaddress' placeholder='name@example.com' />
                        </div>
                    </div>
                </div>
        {/* right */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap3">
                        <h1 className="text-sm font-semibold text-gray-500 pb-2">Professional Information</h1>
                        <div className="flex flex-col border-b border-gray-200 gap-1 py-2 min-w-[350px]">
                            <label htmlFor="specialty" className='capitalize font-bold'>specialty</label>
                            <select className='bg-transparent outline-none' name="specialty" id="specialty">
                                <option value="" disabled selected>Select Specialty</option>
                            </select>
                        </div>
                        <div className="flex flex-col border-b border-gray-200 gap-1 py-2 min-w-[350px]">
                            <label htmlFor="department" className='capitalize font-bold'>department</label>
                            <select className='bg-transparent outline-none' name="department" id="department">
                                <option value="" disabled selected>Select Department</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap3 flex-1">
                        <label htmlFor='about' className="font-semibold text-gray-500 pb-2">About</label>
                        <textarea name="about" id="about" className='resize-none bg-gray-200 rounded flex-1' ></textarea>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}