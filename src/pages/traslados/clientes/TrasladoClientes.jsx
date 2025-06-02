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
  Checkbox,
  ListItemText,
} from '@mui/material';

const TrasladarClientes = () => {
  const API_BASE = `${import.meta.env.VITE_API_URL}`;
  const token = localStorage.getItem('token');

  const [oficinas, setOficinas] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [sourceOffice, setSourceOffice] = useState('');
  const [sourceRoute, setSourceRoute] = useState('');
  const [targetOffice, setTargetOffice] = useState('');
  const [targetRoute, setTargetRoute] = useState('');
  const [reason, setReason] = useState('');
  const [clients, setClients] = useState([]);

  const getOficinas = async () => {
    try {
      const response = await axios.get(`${API_BASE}oficinas/rutas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOficinas(response.data);
    } catch (error) {
      toast.error('Ha ocurrido un error al cargar las oficinas', { position: 'bottom-center' });
    }
  };

  const getRoutesForOffice = (officeId) =>
    oficinas.find((o) => o.id === parseInt(officeId))?.rutas || [];

  useEffect(() => {
    getOficinas();
  }, []);

  useEffect(() => {
    if (sourceRoute) {
      axios
        .get(`${API_BASE}clientes/ruta-wo/${sourceRoute}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setClients(res.data);
        })
        .catch(() => {
          toast.error('Error al cargar los clientes', { position: 'bottom-center' });
          setClients([]);
        });
    } else {
      setClients([]);
    }
  }, [sourceRoute]);

  const filteredClients = clients;

  const handleTransfer = async () => {
    if (
      selectedClients.length === 0 ||
      !sourceOffice ||
      !sourceRoute ||
      !targetOffice ||
      !targetRoute ||
      !reason
    ) {
      toast.error('Por favor completa todos los campos');
      return;
    }
  
    const payload = {
      oficina_origen_id: parseInt(sourceOffice),
      ruta_origen_id: parseInt(sourceRoute),
      cliente_ids: selectedClients,
      oficina_destino_id: parseInt(targetOffice),
      ruta_destino_id: parseInt(targetRoute),
      motivo_traslado: reason,
    };
  
    try {
      await axios.post(`${API_BASE}traslado/clientes`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Clientes trasladados con éxito');
      // Limpiar estados después de éxito
      setSelectedClients([]);
      setSourceOffice('');
      setSourceRoute('');
      setTargetOffice('');
      setTargetRoute('');
      setReason('');
      setClients([]);
    } catch (error) {
      console.error(error);
      toast.error('Error al trasladar clientes');
    }
  };  

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Trasladar Cliente(s) de Ruta
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
                    setSelectedClients([]);
                    setClients([]);
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
                  onChange={(e) => {
                    setSourceRoute(e.target.value);
                    setSelectedClients([]);
                  }}
                >
                  {getRoutesForOffice(sourceOffice).map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: '440px' }} disabled={!sourceRoute}>
                <InputLabel>Clientes</InputLabel>
                <Select
                  multiple
                  value={selectedClients}
                  onChange={(e) => setSelectedClients(e.target.value)}
                  renderValue={(selected) =>
                    filteredClients
                      .filter((c) => selected.includes(c.id))
                      .map((c) => c.nombres)
                      .join(', ')
                  }
                >
                  <MenuItem value="all">
                    <Checkbox
                      checked={
                        selectedClients.length > 0 &&
                        filteredClients.every((c) =>
                          selectedClients.includes(c.id)
                        )
                      }
                      indeterminate={
                        selectedClients.length > 0 &&
                        filteredClients.some((c) =>
                          selectedClients.includes(c.id)
                        ) &&
                        !filteredClients.every((c) =>
                          selectedClients.includes(c.id)
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClients(filteredClients.map((c) => c.id));
                        } else {
                          setSelectedClients([]);
                        }
                      }}
                    />
                    <ListItemText primary="Seleccionar todos" />
                  </MenuItem>

                  {filteredClients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      <Checkbox checked={selectedClients.includes(client.id)} />
                      <ListItemText primary={client.nombres} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Clientes de la ruta origen */}
            <Grid item size={6}>
              <FormControl sx={{ mb: 2 }} fullWidth>
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
              <FormControl sx={{ mb: 2 }} fullWidth disabled={!targetOffice}>
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
                  selectedClients.length === 0 ||
                  !sourceOffice ||
                  !sourceRoute ||
                  !targetOffice ||
                  !targetRoute ||
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

export default TrasladarClientes;