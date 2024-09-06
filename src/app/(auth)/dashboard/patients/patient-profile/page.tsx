import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from 'next/image';


type Props = {}

export default function PatientProfilePage({}: Props) {
  return (
    <div className='flex flex-col gap-4 p-3'>
        <div className="flex gap-5 items-center px-3">
            <div className="flex gap-2 items-center font-semibold">
                <p>Patients</p>
                <KeyboardArrowDownIcon/>
            </div>
            <div className=""><p>Albert Ehimoroo </p></div>
        </div>
        <div className="flex gap-10">
{/* left */}
            <div className="flex flex-col gap-7 p-4 w-1/3 min-w-80 rounded bg-white">
                <div className="flex gap-4 items-center  xxl:justify-start justify-center  flex-wrap">
<Image 
  src="/images/img-p2.png" 
  alt="" 
  width={192} 
  height={192} 
  className='object-cover rounded-full' 
/>
                    <div className="flex flex-col gap-3 ">
                        <p className='text-xl font-semibold'>Albert Ehimoroo </p>
                        <p className='text-gray-400 font-semibold'>Reg:KEFT237YY82</p>
                        <p className='text-gray-400 font-semibold'>MALE</p>
                        <p className='text-gray-400 font-semibold'>41 YEARS</p>
                        <p className='text-gray-400 font-semibold flex justify-between'><span className='font-light'>Date Joined:</span> <span>6/9/23</span></p>
                    </div>
                </div>
        {/* BASIC INFOMATION */}
                <div className="flex flex-col gap-3">
                    <p className='text-accent font-bold'>Basic Information</p>
                    <div className="flex flex-col gap-2 ">
                        <div className="flex gap-4 items-center">
                            <span className='w-1/3'>Marital Status</span>
                            <span className='font-bold capitalize w-2/3'>Married</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className='w-1/3'>Occupation</span>
                            <span className='font-bold capitalize w-2/3'>School Teacher</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className='w-1/3'>Home Address</span>
                            <span className='font-bold capitalize w-2/3'>Nairobi, Kenya</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className='w-1/3 flex gap-4 items-center'>
<Image src="/images/phone.svg" alt="" width={24} height={24} />
                                <span>Phone</span>
                            </div>
                            <span className='font-bold w-2/3'>+123 456 734 829</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className='w-1/3 flex gap-4 items-center'>
<Image src="/images/email.svg" alt="" width={24} height={24} />
                                <span>Email</span>
                            </div>
                            <span className='font-bold  w-2/3 truncate'>Albertehimoroo@gmail.commmmmmmmmmm</span>
                        </div>
                    </div>
                </div>
        {/* NEXT OF KIN INFORMATION */}
                <div className="flex flex-col gap-3">
                    <p className='text-accent font-bold'>Next Of Kin Information</p>
                    <div className="flex flex-col gap-2 ">
                        <div className="flex gap-4 items-center">
                            <span className='w-1/3'>Name</span>
                            <span className='font-bold capitalize w-2/3'>Jane Ehimiroo</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className='w-1/3'>Relationship</span>
                            <span className='font-bold capitalize w-2/3'>Wife</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className='w-1/3'>Home Address</span>
                            <span className='font-bold capitalize w-2/3'>Nairobi, Kenya</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className='w-1/3 flex gap-4 items-center'>
<Image src="/images/phone.svg" alt="" width={24} height={24} />
                                <span>Phone</span>
                            </div>
                            <span className='font-bold w-2/3'>+123 456 734 829</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className='w-1/3 flex gap-4 items-center'>
<Image src="/images/email.svg" alt="" width={24} height={24} />
                                <span>Email</span>
                            </div>
                            <span className='font-bold w-2/3 truncate'>janeehimoroo@gmail.commmmmmmmmmm</span>
                        </div>
                    </div>
                </div>
                <button className='border-2 border-primary font-bold hover:border-accent bg-primary hover:bg-accent text-white p-3 w-52 rounded-xl self-center'>Add Appointment</button>
                <button className='border-4 border-black font-bold hover:border-accent hover:bg-accent hover:text-white p-3 w-52 rounded-xl self-center'>Send Message</button>
            </div>
{/* right */}
            <div className="flex flex-col w-2/3 gap-3 ">
                <div className="flex  justify-between items-center mb-4">
                    <p className='text-accent font-bold'>Medical Information</p>
<Image src="/images/Edit.svg" alt="" width={24} height={24} />
                </div>
                <div className="flex gap-5 flex-wrap">
                    <div className="py-6 px-8 flex-1 max-w-56 flex flex-col bg-white shadow-lg rounded-xl items-center gap-4">
                        <div className="flex gap-1">
<Image src="/images/Rule.svg" alt="" width={24} height={24} />
                            <p className='text-blue-900'>Height</p>
                        </div>
                        <p className='text-red-300'>5ft7inch</p>
                    </div>
                    <div className="py-6 px-8 flex-1 max-w-56 flex flex-col bg-white shadow-lg rounded-xl items-center gap-4">
                        <div className="flex gap-1">
<Image src="/images/weight.svg" alt="" width={24} height={24} />
                            <p className='text-blue-900'>Weight</p>
                        </div>
                        <p className='text-red-300'>140lb</p>
                    </div>
                    <div className="py-6 px-8 flex-1 max-w-56 flex flex-col bg-white shadow-lg rounded-xl items-center gap-4">
                        <div className="flex gap-1">
<Image src="/images/Rule.svg" alt="" width={24} height={24} />
                            <p className='text-blue-900'>Alcohol</p>
                        </div>
                        <p className='text-red-300'>No</p>
                    </div>
                    <div className="py-6 px-8 flex-1 max-w-56 flex flex-col bg-white shadow-lg rounded-xl items-center gap-4">
                        <div className="flex gap-1">
<Image src="/images/Rule.svg" alt="" width={24} height={24} />
                            <p className='text-blue-900'>Body Type</p>
                        </div>
                        <p className='text-red-300'>Endomorph</p>
                    </div>
                    <div className="py-6 px-8 flex-1 max-w-56 flex flex-col bg-white shadow-lg rounded-xl items-center gap-4">
                        <div className="flex gap-1">
<Image src="/images/Rule.svg" alt="" width={24} height={24} />
                            <p className='text-blue-900'>Drugs</p>
                        </div>
                        <p className='text-red-300'>No</p>
                    </div>
                </div>
        {/* Appointments */}
                <div className="flex flex-col p-4 gap-5 bg-white rounded">
                    <div className="flex gap-7 items-center p-4 bg-blue-100 rounded">
                        <p className='font-bold text-gray-500'>Upcoming Appointment</p>
                        <p className='font-bold text-gray-500'>Previous Appointment</p>
                    </div>
                    <div className=" flex flex-col overflow-y-scroll max-h-60">
                        <table className=''>
                            <tbody className=''>
                                <tr className='py-3 flex'>
                                    <td className='flex  flex-1 justify-start items-center gap-4 px-3 border-r border-blue-100'>
                                    <input type="checkbox"/> 
                                    <div className="flex flex-col gap-1">
                                            <p className='text-blue-900 font-bold'>26 June, 2023</p>
                                            <p className='text-primary'>9:00-10:00</p>
                                    </div>
                                    </td>
                                    <td className='flex flex-col  flex-1 justify-center items-center border-r border-blue-100'>
                                        <div className="flex flex-col gap-1">
                                            <p className='text-gray-400 text-sm'>Type</p>
                                            <p className='text-blue-900 text-lg'>Video Call</p>
                                        </div>
                                    </td>
                                    <td className='flex flex-col  flex-1 justify-center items-center border-r border-blue-100'>
                                        <div className="flex flex-col gap-1">
                                            <p className='text-gray-400 text-sm'>Treatment</p>
                                            <p className='text-blue-900 text-lg'>Allergies</p>
                                        </div>
                                    </td>
                                    <td className='flex flex-col  flex-1 justify-center items-center border-r border-blue-100'>
                                        <div className="flex flex-col gap-1">
                                            <p className='text-gray-400 text-sm'>Doctor</p>
                                            <p className='text-blue-900 text-lg'>Dr Jane Doe</p>
                                        </div>
                                    </td>
                                    <td className='flex flex-col  flex-1 justify-center items-center'>
                                        <div className="flex gap-3">
                                            <p className='text-blue-900 text-lg'>Notes</p>
<Image src="/images/notes.svg" alt="" width={24} height={24} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex gap-10 ">
        {/* Patient Notes */}
                    <div className="flex flex-col gap-2 bg-white w-1/2 rounded p-4">
                        <p className='text-primary font-bold'>Patient Notes</p>
                        <div className="bg-slate-100 p-5 rounded-xl">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi necessitatibus architecto cumque ad quos quod accusantium dolores repellendus voluptatem, consequatur ullam quasi porro dicta illo corrupti, dolor expedita enim culpa! <br/>
                            Recusandae provident modi aliquam maiores placeat fugit consequatur eaque! Iusto, dignissimos quas possimus atque rem molestias sint minima quasi repellat voluptatem soluta repudiandae ex velit beatae accusantium error veniam vero.</p>
                        </div>
                    </div>
        {/* Files / Documents */}
                    <div className="flex flex-col gap-2 bg-white w-1/2 rounded p-4">
                        <div className="flex justify-between items-center gap-9">
                            <p className='text-primary font-bold'>Files / Documents </p>
                            <MoreVertIcon/>
                        </div>
                        <div className="flex bg-slate-100 p-4 gap-4 items-center justify-between rounded-xl">
                            <div className="flex gap-4 items-center">
<Image src="/images/notes.svg" alt="" width={24} height={24} />
                                <p>Checkup Result.2.Pdf</p>
                            </div>
                            <span>123kb</span>
                        </div>
                        <div className="flex bg-slate-100 p-4 gap-4 items-center justify-between rounded-xl">
                            <div className="flex gap-4 items-center">
<Image src="/images/notes.svg" alt="" width={24} height={24} />
                                <p>X-ray Result.2.Pdf</p>
                            </div>
                            <span>123kb</span>
                        </div>
                        <div className="flex bg-slate-100 p-4 gap-4 items-center justify-between rounded-xl">
                            <div className="flex gap-4 items-center">
<Image src="/images/notes.svg" alt="" width={24} height={24} />
                                <p>Checkup Result.2.Pdf</p>
                            </div>
                            <span>123kb</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
