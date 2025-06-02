import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuboLogo from './QuboLogo';
import toast from 'react-hot-toast'; // Importar react-hot-toast

const Login = ({mode}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    // Mostrar el toast de carga
    const loadingToast = toast.loading('Iniciando sesión...', {
      position: 'bottom-center',
      duration: 1000, // El toast permanecerá hasta que se cierre manualmente
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}login/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // IMPORTANTE si el backend usa cookies o sesiones
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar el token
        localStorage.setItem('token', data.token);

        // Mostrar un toast de éxito y redirigir al dashboard
        toast.success('¡Inicio de sesión exitoso!', { id: loadingToast, duration: 1000 });
        setTimeout(() => {
          navigate('/clientes');
        }, 2000); // Redirigir después de un pequeño retraso
      } else {
        // Mostrar un toast de error
        toast.error(data.message || 'Credenciales inválidas', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Error de red o del servidor', { id: loadingToast, duration: 1000 });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: 'background.default',
        boxSizing: 'border-box',
        padding: 2,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 380,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        }}
      >
        <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
          <QuboLogo mode={mode}></QuboLogo>
        </div>
        <Typography
          variant="body2"
          align="center"
          sx={{ marginBottom: 2, fontWeight: 'bold' }}
        >
          Ingresa tus credenciales para acceder
        </Typography>

        <TextField
          label="Email"
          size="small"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          size="small"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          size="large"
          onClick={handleLogin}
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Entrar
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;