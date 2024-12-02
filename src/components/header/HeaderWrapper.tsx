// File: src/components/header/HeaderWrapper.tsx

import React from "react";
import Header from "./ui/Header";
import { getUserProfile } from "@/lib/session";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const HeaderWrapper: React.FC = async () => {
    // Fetch user profile and filter necessary data
    const session = await getServerSession(authOptions);
    const profile = session?.user ? await getUserProfile(session.user.id) : null;

    // Filter the required fields
    const profileData = profile
        ? {
              firstName: profile.firstName,
              imageUrl: profile.imageUrl,
              role: profile.user.role,
          }
        : null;

    return <Header profileData={profileData} />;
};

export default HeaderWrapper;
