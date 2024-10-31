// src/types/react-json-view-lite.d.ts

declare module 'react-json-view-lite' {
    import { FC } from 'react';

    interface JsonViewProps {
        data: Object | any[];
    }

    const JsonView: FC<JsonViewProps>;
    export default JsonView;
}
