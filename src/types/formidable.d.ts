// types/formidable.d.ts
declare module "formidable" {
    import { IncomingMessage } from "http";
    import { EventEmitter } from "events";

    interface File {
        file: any;
        size: number;
        path: string;
        name: string | null;
        type: string | null;
        lastModifiedDate?: Date;
        hash?: string;
    }

    interface Files {
        [key: string]: File | File[];
    }

    interface Fields {
        [key: string]: string | string[];
    }

    interface FormidableError extends Error {
        httpCode?: number;
        toJSON?: () => object;
    }

    interface FormidableOptions {
        encoding?: string;
        uploadDir?: string;
        keepExtensions?: boolean;
        maxFileSize?: number;
        maxFieldsSize?: number;
        maxFields?: number;
        hash?: boolean | "sha1" | "md5";
        multiples?: boolean;
    }

    class IncomingForm extends EventEmitter {
        constructor(options?: FormidableOptions);
        parse(
            req: IncomingMessage,
            callback?: (
                err: FormidableError,
                fields: Fields,
                files: Files
            ) => void
        ): void;
        onPart(part: any): void;
    }

    export { IncomingForm, File, Fields, Files };
}
