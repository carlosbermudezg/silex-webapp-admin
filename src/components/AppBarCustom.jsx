import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  Select,
  InputLabel
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import QuboLogo from './QuboLogo';

const AppBarCustom = ({ toggleDarkMode, onToggleSidebar, themeMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const [oficinas, setOficinas] = useState([]);
  const [oficinaSeleccionada, setOficinaSeleccionada] = useState(localStorage.getItem('oficinaId') || '');
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(localStorage.getItem('rutaId') || '');

  const token = localStorage.getItem('token');

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogoutWithToast = () => {
    const loadingToast = toast.loading('Cerrando sesión...', {
      position: 'bottom-center',
      duration: 3000,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('oficinaId');
    localStorage.removeItem('rutaId');
    setTimeout(() => {
      toast.dismiss(loadingToast);
      navigate('/');
    }, 3000);
  };

  const handleLogout = () => {
    handleClose();
    handleLogoutWithToast();
  };

  const fetchOficinas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}oficinas?page=1&limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await res.json();
      const data = result.data?.data || []; // <- esta línea corrige el acceso
      setOficinas(data);

      const savedOficina = data.find((o) => o.id.toString() === oficinaSeleccionada);
      if (savedOficina) {
        setRutas(savedOficina.rutas || []);

        // Restaurar ruta si aún es válida
        const rutaValida = savedOficina.rutas.find(r => r.id.toString() === rutaSeleccionada);
        if (!rutaValida) {
          setRutaSeleccionada('');
          localStorage.removeItem('rutaId');
        }
      }
    } catch (error) {
      console.error('Error al obtener oficinas:', error);
    }
  };

  useEffect(() => {
    fetchOficinas();
  }, []);

  const handleChangeOficina = (event) => {
    const oficinaId = event.target.value;
    if(oficinaId === 'ofiall'){
      // Cuando se selecciona "Todas las oficinas"
      localStorage.setItem('oficinaId', '');
      localStorage.setItem('rutaId', '');
      setOficinaSeleccionada('ofiall'); // Resetea la oficina seleccionada
      setRutaSeleccionada('rutall'); // Resetea la ruta seleccionada
      // Aquí no necesitas actualizar el estado de las rutas ya que no hay oficina seleccionada
    } else {
      const oficina = oficinas.find((o) => o.id === oficinaId);
      setOficinaSeleccionada(oficinaId);
      setRutas(oficina?.rutas || []);
      setRutaSeleccionada(''); // Limpiar la ruta seleccionada cuando se cambia la oficina
      localStorage.setItem('oficinaId', oficinaId);
      localStorage.removeItem('rutaId'); // limpiar ruta si cambia oficina
    }
  };

  const handleChangeRuta = (event) => {
    const rutaId = event.target.value;
    if(rutaId === 'rutall'){
      setRutaSeleccionada('rutall')
      localStorage.setItem('rutaId', '');
    } else {
      setRutaSeleccionada(rutaId);
      localStorage.setItem('rutaId', rutaId);
    }
  };

  return (
    <AppBar position="fixed" color='default' elevation={2} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        
        {/* Logo de Qubo */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" edge="start" onClick={onToggleSidebar}>
            <MenuIcon />
          </IconButton>
          <QuboLogo mode={themeMode} /> {/* Aquí colocas el logo */}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InputLabel id="oficina-label">Oficina</InputLabel>
          <Select
            labelId="oficina-label"
            id="select-oficina"
            value={oficinaSeleccionada}
            onChange={handleChangeOficina}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {oficinas.map((oficina) => (
              <MenuItem key={oficina.id} value={oficina.id}>
                {oficina.nombre}
              </MenuItem>
            ))}
          </Select>

          <InputLabel id="ruta-label">Ruta</InputLabel>
          <Select
            labelId="ruta-label"
            id="select-ruta"
            value={rutaSeleccionada}
            onChange={handleChangeRuta}
            size="small"
            sx={{ minWidth: 150 }}
            disabled={oficinaSeleccionada === 'ofiall' || !rutas.length}
          >
            {rutas.map((ruta) => (
              <MenuItem key={ruta.id} value={ruta.id}>
                {ruta.nombre}
              </MenuItem>
            ))}
          </Select>

          <IconButton color="inherit" onClick={() => {
            setDarkMode(!darkMode);
            toggleDarkMode(!darkMode);
          }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton color="inherit" onClick={handleMenu}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarCustom;