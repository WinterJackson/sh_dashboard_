// src/components/header/HeaderWrapper.tsx

import React from "react";
import Header from "./ui/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import prisma from "@/lib/prisma";

const HeaderWrapper: React.FC = async () => {
    const session = await getServerSession(authOptions);
    const username = session?.user?.username || "Guest User";
    const role = session?.user?.role || "Guest";

    // 1) Fetch user record, including imageUrl
    const userWithProfile = session?.user?.email
        ? await prisma.user.findUnique({
              where: { email: session.user.email },
              select: {
                  profile: {
                      select: { imageUrl: true },
                  },
              },
          })
        : null;

    const imageUrl = userWithProfile?.profile?.imageUrl ?? undefined;

    return <Header username={username} role={role} imageUrl={imageUrl} />;
};

export default HeaderWrapper;
