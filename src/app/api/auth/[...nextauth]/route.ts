// import { handlers } from "@/lib/auth"
// export const { GET, POST } = handlers

import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}