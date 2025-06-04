import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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

const TrasladarEfectivo = () => {
  const API_BASE = `${import.meta.env.VITE_API_URL}`;
  const token = localStorage.getItem('token');

  const [oficinas, setOficinas] = useState([]);
  const [sourceOffice, setSourceOffice] = useState('');
  const [sourceRoute, setSourceRoute] = useState('');
  const [targetOffice, setTargetOffice] = useState('');
  const [targetRoute, setTargetRoute] = useState('');
  const [reason, setReason] = useState('');
  const [monto, setMonto] = useState('');

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
    if (!sourceOffice || !sourceRoute || !targetOffice || !targetRoute || !reason || !monto) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const payload = {
      oficina_origen_id: parseInt(sourceOffice),
      ruta_origen_id: parseInt(sourceRoute),
      oficina_destino_id: parseInt(targetOffice),
      ruta_destino_id: parseInt(targetRoute),
      motivo_traslado: reason,
      monto: parseFloat(monto),
    };

    try {
      await axios.post(`${API_BASE}traslado/efectivo`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Efectivo trasladado con éxito');
      setSourceOffice('');
      setSourceRoute('');
      setTargetOffice('');
      setTargetRoute('');
      setReason('');
      setMonto('');
    } catch (error) {
      console.error(error);
      toast.error('Error al trasladar el efectivo');
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Trasladar Efectivo
          </Typography>

          <Grid container spacing={2}>
            {/* Oficina y Ruta de Origen */}
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

            {/* Oficina y Ruta de Destino */}
            <Grid item size={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Oficina Destino</InputLabel>
                <Select
                  value={targetOffice}
                  onChange={(e) => {
                    setTargetOffice(e.target.value);
                    setTargetRoute('');
                  }}
                >
                  {oficinas.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }} disabled={!targetOffice}>
                <InputLabel>Ruta Destino</InputLabel>
                <Select
                  value={targetRoute}
                  onChange={(e) => setTargetRoute(e.target.value)}
                >
                  {getRoutesForOffice(targetOffice).map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Monto */}
            <Grid item size={12}>
              <TextField
                label="Monto a Trasladar"
                type="number"
                fullWidth
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </Grid>

            {/* Motivo */}
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

            {/* Botón */}
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
                  !targetRoute ||
                  !reason ||
                  !monto
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

export default TrasladarEfectivo;
