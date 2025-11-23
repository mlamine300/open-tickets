import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-too-cold">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-2xl bg-blue-600 px-6 py-3 text-background-base font-medium shadow hover:bg-blue-700 transition"
      >
        Back to Home
      </a>
    </div>
  );
};

export default NotFound;
