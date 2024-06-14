import { FC, ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
    return <div className="min-h-screen p-10 flex flex-col items-center justify-center">{children}</div>;
};

export default AuthLayout;
