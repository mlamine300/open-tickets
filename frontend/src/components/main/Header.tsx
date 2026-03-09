import { useTheme } from "next-themes";
import { HiOutlineSun, HiMoon } from "react-icons/hi2";
const Header = () => {
  const { theme, setTheme } = useTheme();
  const imageURlWhite=import.meta.env.VITE_HEADER_URL_WHITE||"";
    const imageURlDark=import.meta.env.VITE_HEADER_URL_DARK||"";
    const imageUrl=theme==="light"?imageURlWhite:imageURlDark;
    const mode= import.meta.env.VITE_APP_ENV;
  return (
    <header style={mode==="dev"?{backgroundColor:"#ffcc00"}:{}} className="fixed top-0 pt-2  w-full lg:max-w-screen  flex items-center z-10 border-b border-gray-hot px-10 py-2  bg-background-base max-h-16">
      {imageUrl&&<img src={imageUrl} className="max-h-10 mx-2" /> }
      {mode==="dev"&&<h3 className="m-auto text-4xl font-extrabold italic text-red-600">SESSION TEST</h3>}
      <button
        className="rounded-lg shadow-lg w-12 h-12 flex items-center justify-center ml-auto xl:mr-0"
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
