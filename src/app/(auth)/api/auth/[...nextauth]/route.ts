// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
// import { handlers } from "@/lib/auth"
// export const { GET, POST } = handlers

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}