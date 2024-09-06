import Link from 'next/link'
import React from 'react'

type Props = {}

function LearnMoreCard({}: Props) {
  return (
    <div className='p-4 flex flex-col gap-6 bg-[#006FDBB2] text-white rounded-xl w-full'>
        <h1 className='font-semibold capitalize text-wrap text-center'>Snark health is now available in 10 African countries</h1>
        <p className='truncate-lines'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus porro modi, rem in laboriosam mollitia tempora recusandae veritatis et eius sapiente odit voluptas ipsum quia distinctio suscipit dolores vero ullam.</p>
        <div className="w-full flex justify-end">
            <Link href={"#"}>
                <button className='text-lg font-bold'>
                    Learn More
                </button>
            </Link>
        </div>
    </div>
  )
}

export default LearnMoreCard