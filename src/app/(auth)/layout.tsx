// src/app/(auth)/layout.tsx

import { FC, ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
    return <div className="min-h-screen w-full flex flex-col items-center justify-center">{children}</div>;
};

export default AuthLayout;
