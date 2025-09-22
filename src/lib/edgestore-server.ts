// src/lib/edgestore-server.ts

import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

// Initialize EdgeStore instance
const es = initEdgeStore.create();

// Define router with buckets
export const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
  doctorImages: es.imageBucket({
    maxSize: 5 * 1024 * 1024, // 5 MB
    accept: ["image/jpeg", "image/png"],
  }),
});

// Create Next.js App Router handler
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

// ✅ Export GET/POST handlers for Next.js
export { handler as GET, handler as POST };

// ✅ Export router type for client
export type EdgeStoreRouter = typeof edgeStoreRouter;
