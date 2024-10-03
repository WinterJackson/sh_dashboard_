import React from 'react'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PatientCard from './patient card/PatientCard';

type Props = {}

function Doc_Patients({}: Props) {
  return (
    <div className='flex flex-col gap-8 py-3 px-8'>
        <div className="flex flex-col gap-5">
            <div className="flex gap-6 items-center">
                <h1 className="font-semibold text-lg">All Patients </h1>
                <div className="flex gap-2 items-center font-semibold">
                    <p>Filter By </p>
                    <KeyboardArrowDownIcon />
                </div>
            </div>
            <p className='capitalize'>There are 50 patients Currently assigned to you</p>
        </div>
        <div className="flex flex-wrap gap-3">
          
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
          <PatientCard/>
        </div>
    </div>
  )
}

export default Doc_Patients