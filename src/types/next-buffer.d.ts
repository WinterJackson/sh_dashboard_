// types/next-buffer.d.ts

declare module "next-buffer" {
    // Re-export everything from the npm 'buffer' polyfill
    import { Buffer } from "buffer";
    export { Buffer };
}
