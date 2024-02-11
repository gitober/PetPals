import { Outlet } from "react-router-dom";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <main>
      {children}
      <Outlet />
      </main>
    </div>
  );
};

export default Layout;
