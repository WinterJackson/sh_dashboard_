// src/components/ui/loading.tsx

import ReactDOM from 'react-dom';

const LoadingSpinner = () => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] pointer-events-none">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>,
        document.body
    );
};

export default LoadingSpinner;
