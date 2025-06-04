import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';

const TrasladarRutas = () => {
  const API_BASE = `${import.meta.env.VITE_API_URL}`;
  const token = localStorage.getItem('token');

  const [oficinas, setOficinas] = useState([]);
  const [sourceOffice, setSourceOffice] = useState('');
  const [sourceRoute, setSourceRoute] = useState('');
  const [targetOffice, setTargetOffice] = useState('');
  const [reason, setReason] = useState('');

  const getOficinas = async () => {
    try {
      const response = await axios.get(`${API_BASE}oficinas/rutas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOficinas(response.data);
    } catch (error) {
      toast.error('Error al cargar las oficinas', { position: 'bottom-center' });
    }
  };

  useEffect(() => {
    getOficinas();
  }, []);

  const getRoutesForOffice = (officeId) =>
    oficinas.find((o) => o.id === parseInt(officeId))?.rutas || [];

  const handleTransfer = async () => {
    if (!sourceOffice || !sourceRoute || !targetOffice || !reason) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const payload = {
      oficina_origen_id: parseInt(sourceOffice),
      ruta_id: parseInt(sourceRoute),
      oficina_destino_id: parseInt(targetOffice),
      motivo_traslado: reason,
    };

    try {
      await axios.post(`${API_BASE}traslado/rutas`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Ruta trasladada con éxito');
      setSourceOffice('');
      setSourceRoute('');
      setTargetOffice('');
      setReason('');
    } catch (error) {
      console.error(error);
      toast.error('Error al trasladar la ruta');
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Trasladar Ruta de Oficina
          </Typography>

          <Grid container spacing={2}>
            <Grid item size={6} gap={10}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Oficina Origen</InputLabel>
                <Select
                  value={sourceOffice}
                  onChange={(e) => {
                    setSourceOffice(e.target.value);
                    setSourceRoute('');
                  }}
                >
                  {oficinas.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }} disabled={!sourceOffice}>
                <InputLabel>Ruta Origen</InputLabel>
                <Select
                  value={sourceRoute}
                  onChange={(e) => setSourceRoute(e.target.value)}
                >
                  {getRoutesForOffice(sourceOffice).map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Oficina Destino</InputLabel>
                <Select
                  value={targetOffice}
                  onChange={(e) => setTargetOffice(e.target.value)}
                >
                  {oficinas.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={12}>
              <TextField
                label="Motivo del Traslado"
                multiline
                rows={3}
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Grid>

            <Grid item size={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleTransfer}
                disabled={
                  !sourceOffice ||
                  !sourceRoute ||
                  !targetOffice ||
                  !reason
                }
              >
                Confirmar Traslado
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TrasladarRutas;