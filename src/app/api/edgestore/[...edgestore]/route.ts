// File: src/app/api/edgestore/[...edgestore]/route.ts

import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
    doctorImages: es.imageBucket({
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: ['image/jpeg', 'image/png'],
    }),
});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;
