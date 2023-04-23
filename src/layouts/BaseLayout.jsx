import Link from "next/link";
import { useTheme } from "next-themes";
import { BsSun, BsMoon } from "react-icons/bs";

const BaseLayout = ({ children }) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex h-full flex-col gap-12">
      <div className="h-20 border-b shadow px-8 flex items-center text-xl font-semibold justify-between">
        <Link href="/">Dvstr Radio</Link>
        <button
          className="hover:text-blue-500"
          onClick={() =>
            theme === "dark" ? setTheme("light") : setTheme("dark")
          }
        >
          {currentTheme === "dark" ? <BsSun /> : <BsMoon />}
        </button>
      </div>
      {children}
    </div>
  );
};

export default BaseLayout;
