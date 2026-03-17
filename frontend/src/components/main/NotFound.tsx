import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 w-full">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
       Page introuvable
      </h2>
      <p className="mt-2 text-gray-too-cold">
        La page que vous essayez d'accéder n'existe plus sur le serveur
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-2xl bg-primary px-6 py-3 text-background-base font-medium shadow hover:bg-primary/80 transition"
      >
        Retour à L'accueil
      </a>
    </div>
  );
};

export default NotFound;
