import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import AppBarCustom from "../components/AppBarCustom";

const MainLayout = ({toggleDarkMode, themeMode}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBarCustom toggleDarkMode={toggleDarkMode} themeMode={themeMode} onToggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <Box component="main" sx={{ flexGrow: 1, padding: 3, marginTop: '32px' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;