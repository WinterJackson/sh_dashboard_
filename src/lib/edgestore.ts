// src/lib/edgestore.ts

"use client";

import { createEdgeStoreProvider } from "@edgestore/react";
import type { EdgeStoreRouter } from "./edgestore-server";

// ✅ Creates typed Provider + hook for client
const { EdgeStoreProvider, useEdgeStore } =
    createEdgeStoreProvider<EdgeStoreRouter>();

export { EdgeStoreProvider, useEdgeStore };
