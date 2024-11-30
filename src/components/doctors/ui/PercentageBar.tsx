// src/app/components/doctors/UI components/PercentageBar.tsx

import React from "react";

type Props = {
    percentage: String;
};

function PercentageBar({ percentage }: Props) {
    const stringPercent = String(percentage);
    return (
        <div className="flex flex-1 gap-2 items-center">
            <div className="flex flex-1 relative bg-gray-300 max-w-[300px] h-2 rounded-xl">
                <div
                    className={`absolute top-0 left-0 rounded-xl bg-primary h-full `}
                    style={{ width: `${stringPercent}` }}
                ></div>
                {/* <div className={`absolute top-0 left-0 rounded-xl bg-primary h-full w-[13%]`}></div> */}
            </div>
        </div>
    );
}

export default PercentageBar;
