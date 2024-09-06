import React from 'react'

type Props = {}

function AddDoctorPage({}: Props) {
  return (
    <div className='h-full w-full bg-white flex flex-col gap-6 p-6 overflow-y-scroll'>
        <h1 className="font-bold text-xl">Add New Doctor</h1>
        <form className="flex flex-col gap-7">
            <div className="flex gap-7 flex-wrap">
                <div className="flex flex-col w-1/3 gap-4 min-w-[360px] max-w-[500px] flex-1">
                    <h1 className="font-semibold text-primary">Upload Profile Picture</h1>
                    <div className=""></div>
                </div>
                <div className="flex flex-col w-1/3 gap-4 min-w-[360px] max-w-[500px] flex-1">
                    <h1 className="font-semibold text-primary">Bio</h1>
                    <div className="flex flex-col">
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label htmlFor="surname" className='capitalize font-semibold'>surname</label>
                            <input type="text" id='surname' className='outline-none' placeholder='Enter Name'/>
                        </div>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label htmlFor="first-name" className='capitalize font-semibold'>first name</label>
                            <input type="text" id='first-name' className='outline-none' placeholder='Enter Name'/>
                        </div>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label htmlFor="age" className='capitalize font-semibold'>age</label>
                            <input type="text" id='age' className='outline-none' placeholder='Enter Age'/>
                        </div>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label htmlFor="gender" className='capitalize font-semibold'>gender</label>
                            <select name="gender" id="gender" className='outline-none'>
                                <option value="" disabled selected>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-1/3 gap-4 min-w-[360px] max-w-[500px] flex-1">
                    <h1 className="font-semibold text-primary">Contact Information</h1>
                    <div className="flex flex-col">
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label htmlFor="phonenumber" className='capitalize font-semibold'>phone number</label>
                            <input type="text" id='phonenumber' className='outline-none' placeholder='+234 *********'/>
                        </div>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label htmlFor="emailaddress" className='capitalize font-semibold'>email address</label>
                            <input type="email" id='emailaddress' className='outline-none' placeholder='name@example.com'/>
                        </div>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label htmlFor="city" className='capitalize font-semibold'>City</label>
                            <select name="city" id="city" className='outline-none'>
                                <option value=""disabled selected>Select City</option>
                            </select>
                        </div>
                        <div className="py-3 border-b flex flex-col gap-2">
                            <label htmlFor="state" className='capitalize font-semibold'>State</label>
                            <select name="state" id="state" className='outline-none'>
                                <option value=""disabled selected>Select State</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 ">
                <h1 className='text-primary font-semibold capitalize'>Professional information</h1>
                <div className="flex gap-8 w-full flex-wrap">
                    <div className="py-3 border-b flex flex-col gap-2 flex-1 min-w-[360px]">
                        <label htmlFor="specialty" className='capitalize font-semibold'>specialty</label>
                        <select name="specialty" id="specialty" className='outline-none'>
                            <option value=""disabled selected>Eg Gynecologist</option>
                        </select>
                    </div>
                    <div className="py-3 border-b flex flex-col gap-2 flex-1 min-w-[360px]">
                        <label htmlFor="department" className='capitalize font-semibold'>department</label>
                        <select name="department" id="department" className='outline-none'>
                            <option value=""disabled selected>Eg Women's Health</option>
                        </select>
                    </div>
                    <div className="py-3 border-b flex flex-col gap-2 flex-1 min-w-[360px]">
                        <label htmlFor="Qualifications" className='capitalize font-semibold'>Qualifications</label>
                        <select name="Qualifications" id="Qualifications" className='outline-none'>
                            <option value=""disabled selected>Mbbs</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <label htmlFor='about' className="text-primary font-semibold">About</label>
                <textarea name="about" id="about" className='bg-slate-200 h-[250px] resize-none outline-none rounded'></textarea>
            </div>
        </form>
    </div>
  )
}

export default AddDoctorPage