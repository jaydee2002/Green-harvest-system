import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 text-red-600 p-4 rounded-full shadow">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900">404</h1>
        <p className="mt-3 text-lg text-gray-700">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mt-1">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
