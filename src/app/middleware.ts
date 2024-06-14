// src/app/middleware.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => void;
