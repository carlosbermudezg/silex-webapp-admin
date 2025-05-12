import React, { useState } from 'react';
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

const TrasladarRutas = () => {
  // Datos ficticios
  const clients = [
    { id: '1', name: 'Juan Pérez', routeId: 'r1' },
    { id: '2', name: 'Ana Gómez', routeId: 'r2' },
    { id: '3', name: 'Carlos Ruiz', routeId: 'r1' },
    { id: '4', name: 'Lucía Fernández', routeId: 'r3' },
  ];

  const offices = [
    {
      id: 'of1',
      name: 'Oficina Centro',
      routes: [
        { id: 'r1', name: 'Ruta A' },
        { id: 'r2', name: 'Ruta B' },
      ],
    },
    {
      id: 'of2',
      name: 'Oficina Norte',
      routes: [
        { id: 'r3', name: 'Ruta C' },
        { id: 'r4', name: 'Ruta D' },
      ],
    },
  ];

  const [selectedClients, setSelectedClients] = useState([]);
  const [sourceOffice, setSourceOffice] = useState('');
  const [sourceRoute, setSourceRoute] = useState('');
  const [targetOffice, setTargetOffice] = useState('');
  const [targetRoute, setTargetRoute] = useState('');
  const [reason, setReason] = useState('');

  const getRoutesForOffice = (officeId) =>
    offices.find((o) => o.id === officeId)?.routes || [];

  const filteredClients = clients.filter((c) => c.routeId === sourceRoute);

  const handleTransfer = () => {
    alert(JSON.stringify({
      clients: selectedClients,
      from: { office: sourceOffice, route: sourceRoute },
      to: { office: targetOffice, route: targetRoute },
      reason,
    }, null, 2));
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Trasladar Rutas
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
                  }}
                >
                  {offices.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.name}
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
                      {route.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }} disabled={!sourceRoute}>
                <InputLabel>Clientes</InputLabel>
                <Select
                  multiple
                  value={selectedClients}
                  onChange={(e) => setSelectedClients(e.target.value)}
                  renderValue={(selected) =>
                    filteredClients
                      .filter((c) => selected.includes(c.id))
                      .map((c) => c.name)
                      .join(', ')
                  }
                >
                  {filteredClients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      <Checkbox checked={selectedClients.includes(client.id)} />
                      <ListItemText primary={client.name} />
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
                  {offices.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.name}
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
                      {route.name}
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

export default TrasladarRutas;