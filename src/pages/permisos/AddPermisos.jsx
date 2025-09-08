'use client';
import * as React from 'react';
import {
  Box, Grid, Typography, TextField, Button, Paper, Divider, Switch, FormControlLabel
} from '@mui/material';
import toast from 'react-hot-toast';
import permisosAgrupados from './permisosList';

export default function AddPermisos() {
  const [nombrePermiso, setNombrePermiso] = React.useState('');
  const [permisosSeleccionados, setPermisosSeleccionados] = React.useState({});
  const token = localStorage.getItem('token');

  const togglePermiso = (permiso) => {
    setPermisosSeleccionados(prev => ({
      ...prev,
      [permiso]: !prev[permiso]
    }));
  };

  const handleGuardar = async () => {
    if (!nombrePermiso) {
      toast.error('Debe ingresar un nombre para el permiso');
      return;
    }

    try {
      const permisosActivos = Object.entries(permisosSeleccionados)
        .filter(([activo]) => activo)
        .map(([permiso]) => permiso);

      const res = await fetch(`${import.meta.env.VITE_API_URL}permisos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
            nombre: nombrePermiso,
            descripcion: permisosActivos 
        })
      });

      if (!res.ok) throw new Error('Error al guardar permiso');
      toast.success('Permiso agregado!');
    } catch (err) {
      toast.error('No se pudo guardar el permiso');
      console.error(err);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Agregar Permiso Nuevo
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField
              fullWidth
              size='small'
              label="Nombre del permiso"
              value={nombrePermiso}
              onChange={(e) => setNombrePermiso(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGuardar}
            >
              Guardar Permiso
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {Object.entries(permisosAgrupados).map(([grupo, permisos]) => (
          <Box key={grupo} sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, borderBottom: '2px solid #1976d2', pb: 1 }}>
              {grupo}
            </Typography>
            <Grid container spacing={2}>
              {permisos.map(({ name, permiso }) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={permiso}>
                  <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!permisosSeleccionados[permiso]}
                          onChange={() => togglePermiso(permiso)}
                          color="primary"
                          size='small'
                        />
                      }
                      label={<Typography sx={{ fontWeight: 500 }}>{name}</Typography>}
                      sx={{ width: '100%' }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

      </Paper>
    </Box>
  );
}

AddPermisos.requireAuth = true;
