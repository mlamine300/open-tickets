

const Fouter = () => {
  const name=import.meta.env.VITE_APP_NAME||"Open Tickets";
  return (
    <footer className="w-full bg-background-base py-4 shadow-inner">
      <div className="text-center text-gray-too-cold text-sm">
       { `${name} © ${new Date().getFullYear()}  All rights reserved.`}
      </div>
    </footer>
  );
};

export default Fouter;
