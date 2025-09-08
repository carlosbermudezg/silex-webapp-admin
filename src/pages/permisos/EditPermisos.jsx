'use client';
import * as React from 'react';
import {
  Box, Grid, Typography, Button, Paper, Divider, Switch, FormControlLabel, TextField
} from '@mui/material';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import permisosAgrupados from './permisosList';

export default function EditPermisos() {
  const { id: permisoId } = useParams();
  const [nombrePermiso, setNombrePermiso] = React.useState([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = React.useState([]);
  const token = localStorage.getItem('token');

  console.log(permisosSeleccionados)

  React.useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}permisos/${permisoId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('No se pudo obtener el permiso');
        const data = await res.json();
        const permisosActivos = Array.isArray(data?.data?.descripcion) ? data.data.descripcion : [];
        setPermisosSeleccionados(permisosActivos[0]);
        setNombrePermiso(data.data.nombre)
      } catch (err) {
        toast.error('Error al cargar permisos');
        console.error(err);
      }
    };

    if (permisoId) fetchPermisos();
  }, [permisoId, token]);

  const togglePermiso = (permiso) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(permiso)
        ? prev.filter((p) => p !== permiso)
        : [...prev, permiso]
    );
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}permisos/${permisoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          nombre: nombrePermiso,
          descripcion: permisosSeleccionados 
        })
      });

      if (!res.ok) throw new Error('Error al guardar permisos');
      toast.success('Permisos actualizados');
    } catch (err) {
      toast.error('No se pudieron guardar los permisos');
      console.error(err);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Editar Permiso
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
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
              Actualizar Permiso
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {Object.entries(permisosAgrupados).map(([grupo, permisos]) => (
          <Box key={grupo} sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                pb: 1,
              }}
            >
              {grupo}
            </Typography>
            <Grid container spacing={2}>
              {permisos.map(({ name, permiso }) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={permiso}>
                  <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={permisosSeleccionados.includes(permiso)}
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

EditPermisos.requireAuth = true;