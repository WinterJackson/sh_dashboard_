// // src/context/ProfileContext.tsx

// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useSession } from "next-auth/react";
// import { Profile } from "@/lib/definitions";

// interface ProfileContextType {
//     user: Profile | null;
//     error: string | null;
// }

// const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// export const ProfileProvider = ({ children }: { children: ReactNode }) => {
//     const [user, setUser] = useState<Profile | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const { data: session } = useSession();

//     useEffect(() => {
//         const fetchUser = async () => {
//             if (session?.user) {
//                 const userId = session.user.id;

//                 try {
//                     const response = await fetch(`/api/profiles/${userId}`);
//                     if (!response.ok) {
//                         throw new Error(`Failed to fetch user profile: ${response.statusText}`);
//                     }
//                     const profileData = await response.json();

//                     setUser(profileData);
//                 } catch (error) {
//                     setError('Error fetching user profile.');
//                     console.error("Error fetching user profile:", error);
//                 }
//             }
//         };
//         fetchUser();
//     }, [session]);

//     return (
//         <ProfileContext.Provider value={{ user, error }}>
//             {children}
//         </ProfileContext.Provider>
//     );
// };

// export const useUserProfile = (): ProfileContextType => {
//     const context = useContext(ProfileContext);
//     if (context === undefined) {
//         throw new Error("useUser must be used within a UserProvider");
//     }
//     return context;
// };
