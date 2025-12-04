import { useTheme } from "next-themes";
import { HiOutlineSun, HiMoon } from "react-icons/hi2";
const Header = () => {
  const { theme, setTheme } = useTheme();
  const name=import.meta.env.VITE_APP_NAME||"Open Tickets";
  return (
    <header className="fixed top-0 pt-5  w-full max-w-[1440px]  flex items-center z-10 border-b border-gray-hot px-10 py-2  bg-background-base">
      <h4>{name} </h4>
      <button
        className="rounded-lg shadow-lg w-12 h-12 flex items-center justify-center ml-auto xl:mr-20"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      >
        {theme === "light" ? (
          <HiMoon className="w-8 h-8 text-blue-950" />
        ) : (
          <HiOutlineSun className="w-8 h-8 text-amber-400" />
        )}
      </button>
    </header>
  );
};

export default Header;
