import React from "react";

const NotAuthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 w-full">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Page Non Autorisé
      </h2>
      <p className="mt-2 text-gray-too-cold">
       Désolé, vous n’avez pas l’autorisation d’accéder à cette page.
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-2xl bg-red-600 px-6 py-3 text-background-base font-medium shadow hover:bg-red-700 transition"
      >
         Retour à L'accueil
      </a>
    </div>
  );
};

export default NotAuthorized;
