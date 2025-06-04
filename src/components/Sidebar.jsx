import React, { useState } from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse
} from '@mui/material';
import {
  Dashboard, People, Inventory, CreditCard, PointOfSale, Receipt,
  BarChart, Settings, ExpandLess, ExpandMore, Business, LocationOn,
  Map, Lock, Group
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [openReportes, setOpenReportes] = useState(false);
  const [openAjustes, setOpenAjustes] = useState(false);

  const handleToggle = (menu) => {
    if (menu === 'reportes') setOpenReportes((prev) => !prev);
    if (menu === 'ajustes') setOpenAjustes((prev) => !prev);
  };

  const itemStyle = {
    justifyContent: isSidebarOpen ? "initial" : "center",
    width: isSidebarOpen ? 280 : 50
  };

  const iconStyle = {
    minWidth: 0,
    mr: isSidebarOpen ? 2 : 'auto'
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: isSidebarOpen ? 280 : 50,
        transition: 'width 0.3s',
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isSidebarOpen ? 280 : 50,
          marginTop: '64px',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        },
      }}
    >
      <List
        sx={{
          width: isSidebarOpen ? 280 : 50,
          height: '100%',
          overflowY: 'auto',
          paddingBottom: 8, // Espacio extra abajo
          // Scrollbar custom styles
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          }
        }}
      >
        {/* Enlaces simples */}
        <ListItemButton sx={itemStyle} onClick={() => navigate('/dashboard')}>
          <ListItemIcon sx={iconStyle}><Dashboard /></ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Dashboard" />}
        </ListItemButton>
        <ListItemButton sx={itemStyle} onClick={() => navigate('/clientes')}>
          <ListItemIcon sx={iconStyle}><People /></ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Clientes" />}
        </ListItemButton>
        <ListItemButton sx={itemStyle} onClick={() => navigate('/productos')}>
          <ListItemIcon sx={iconStyle}><Inventory /></ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Productos" />}
        </ListItemButton>
        <ListItemButton sx={itemStyle} onClick={() => navigate('/creditos')}>
          <ListItemIcon sx={iconStyle}><CreditCard /></ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Créditos" />}
        </ListItemButton>
        <ListItemButton sx={itemStyle} onClick={() => navigate('/caja')}>
          <ListItemIcon sx={iconStyle}><PointOfSale /></ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Caja" />}
        </ListItemButton>
        {/* <ListItemButton sx={itemStyle} onClick={() => navigate('/recorrido')}>
          <ListItemIcon sx={iconStyle}><PointOfSale /></ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Recorrido" />}
        </ListItemButton> */}
        {/* Submenú Reportes */}
        <ListItemButton sx={itemStyle} onClick={() => handleToggle('reportes')}>
          <ListItemIcon sx={iconStyle}><BarChart /></ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Reportes" />}
          {isSidebarOpen && (openReportes ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        <Collapse in={openReportes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/reportes/estado-cuenta')}>
              <ListItemText primary="Estado de Cuenta" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/reportes/creditos')}>
              <ListItemText primary="Créditos" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/reportes/ingresos-egresos')}>
              <ListItemText primary="Ingresos y Egresos" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/reportes/utilidad')}>
              <ListItemText primary="Utilidad" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Submenú Ajustes */}
        <ListItemButton sx={itemStyle} onClick={() => handleToggle('ajustes')}>
          <ListItemIcon sx={iconStyle}><Settings /></ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Ajustes" />}
          {isSidebarOpen && (openAjustes ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        <Collapse in={openAjustes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/general')}>
              <ListItemText primary="General" />
            </ListItemButton>
            {/* <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/empresa')}>
              <ListItemText primary="Empresa" />
            </ListItemButton> */}
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/oficinas')}>
              <ListItemText primary="Oficinas" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/rutas')}>
              <ListItemText primary="Rutas" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/traslados')}>
              <ListItemText primary="Traslados" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/vehiculos')}>
              <ListItemText primary="Vehículos" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/permisos')}>
              <ListItemText primary="Permisos" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/usuarios')}>
              <ListItemText primary="Usuarios" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/ajustes/backup')}>
              <ListItemText primary="Backup" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;