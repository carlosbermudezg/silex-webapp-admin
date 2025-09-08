import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Switch, Box } from '@mui/material';
import { Brightness7, Brightness4 } from '@mui/icons-material';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/clientes/Clientes';
import Perfil from './pages/clientes/perfil/Perfil';
import Productos from './pages/productos/Productos';
import Creditos from './pages/creditos/Creditos';
import Caja from './pages/caja/Caja';
import Recorrido from './pages/recorrido/Recorrido'
import General from './pages/general/General';
import Oficinas from './pages/oficinas/Oficinas';
import Rutas from './pages/rutas/Rutas';
import Traslados from './pages/traslados/Traslados'
import Vehiculos from './pages/vehiculos/Vehiculos';
import Permisos from './pages/permisos/Permisos';
import AddPermisos from './pages/permisos/AddPermisos';
import EditPermisos from './pages/permisos/EditPermisos';
import Usuarios from './pages/usuarios/Usuarios';
import EstadoCuenta from './pages/reportes/estadocuenta/EstadoCuenta'
import ReporteCreditos from './pages/reportes/creditos/ReporteCreditos';
import ReporteIngresosEgresos from './pages/reportes/ingresos-egresos/ReporteIngresosEgresos';
import ReporteUtilidad from './pages/reportes/utilidad/ReporteUtilidad';
import ProtectedRoute from './components/ProtectedRoutes';
import MainLayout from './layout/MainLayout';
import UseFavicon from './components/UseFavicon';
import { validarToken } from './utils/validarToken';
import Backup from './pages/backup/Backup';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuth, setIsAuth] = useState(validarToken()); // Estado que se actualiza según el token

  UseFavicon(darkMode);

  useEffect(() => {
    // Actualiza isAuth cuando el token cambie
    const interval = setInterval(() => {
      setIsAuth(validarToken());
    }, 1000); // Se verifica cada segundo para mantener el estado actualizado

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, []); // Solo se ejecuta una vez al montarse

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = (event) => {
    const newMode = event;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
        <Switch
          checked={darkMode}
          onChange={(e)=> toggleDarkMode(e.target.checked) }
          icon={<Brightness7 />}
          checkedIcon={<Brightness4 />}
          sx={{
            padding: '1px',
          }}
        />
      </Box>
      <Router>
        <Routes>
          {/* Si el token es válido, redirigir al Dashboard */}
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Login mode={darkMode} />} />
          
          {/* Rutas protegidas */}
          <Route element={<MainLayout toggleDarkMode={toggleDarkMode} themeMode={darkMode}/>}>
            <Route element={<ProtectedRoute isAuth={isAuth} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/perfil/:id" element={<Perfil />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/creditos" element={<Creditos />} />
              <Route path="/caja" element={<Caja />} />
              <Route path="/recorrido" element={<Recorrido />} />
              <Route path="/reportes/estado-cuenta" element={<EstadoCuenta />} />
              <Route path="/reportes/creditos" element={<ReporteCreditos />} />
              <Route path="/reportes/ingresos-egresos" element={<ReporteIngresosEgresos />} />
              <Route path="/reportes/utilidad" element={<ReporteUtilidad />} />
              <Route path="/ajustes/general" element={<General />} />
              <Route path="/ajustes/oficinas" element={<Oficinas />} />
              <Route path="/ajustes/rutas" element={<Rutas/>} />
              <Route path="/ajustes/traslados" element={<Traslados/>} />
              <Route path="/ajustes/vehiculos" element={<Vehiculos/>} />
              <Route path="/ajustes/permisos" element={<Permisos/>} />
              <Route path="/ajustes/permisos/addpermiso" element={<AddPermisos/>} />
              <Route path="/ajustes/permisos/editpermiso/:id" element={<EditPermisos/>} />
              <Route path="/ajustes/usuarios" element={<Usuarios/>} />
              <Route path="/ajustes/backup" element={<Backup/>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;