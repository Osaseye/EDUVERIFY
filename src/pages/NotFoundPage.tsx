import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <span className="material-icons-round text-gray-300 text-8xl mb-4">search_off</span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-bold shadow-sm inline-flex items-center gap-2"
            >
                <span className="material-icons-round text-lg">home</span>
                Back to Dashboard
            </Link>
        </div>
    );
};
