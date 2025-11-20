import React, { type ReactElement } from "react";
import { ThemeProvider } from "next-themes";
import UserProvider from "../context/user/userProvider";

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <ThemeProvider>
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
};

export default Layout;
