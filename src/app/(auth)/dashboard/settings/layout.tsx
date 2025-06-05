// src/app/(auth)/dashboard/settings/layout.tsx

import { FC, ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="w-full p-4 pt-2 space-y-6">
            {/* <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">Settings</h1> */}
            {children}
    </div>
  );
};

export default SettingsLayout;