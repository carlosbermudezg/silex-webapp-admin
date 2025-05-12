'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem
} from '@mui/material';

import { AddCircle, RemoveCircle } from '@mui/icons-material';

export default function Caja() {
  const [saldo, setSaldo] = useState(0);
  const [openIngreso, setOpenIngreso] = useState(false);
  const [openEgreso, setOpenEgreso] = useState(false);
  const [montoIngreso, setMontoIngreso] = useState('');
  const [descripcionIngreso, setDescripcionIngreso] = useState('');
  const [montoEgreso, setMontoEgreso] = useState('');
  const [descripcionEgreso, setDescripcionEgreso] = useState('');
  const [movimientosPendientes, setMovimientosPendientes] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [rutas, setRutas] = useState([
    { id: 1, nombre: 'Ruta 1' },
    { id: 2, nombre: 'Ruta 2' },
    { id: 3, nombre: 'Ruta 3' },
  ]);
  const [modalIngresoOpen, setModalIngresoOpen] = useState(false);
  const [modalEgresoOpen, setModalEgresoOpen] = useState(false);
  const [nuevaRuta, setNuevaRuta] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Simula la carga inicial de datos
    setSaldo(0);
  
    setMovimientosPendientes([
      {
        id: 1,
        tipo: 'Ingreso',
        supervisor: 'María López',
        ruta: 'Ruta 1',
        monto: 500,
        descripcion: 'Ingreso'
      },
      {
        id: 2,
        tipo: 'Ingreso',
        supervisor: 'Carlos Ramírez',
        ruta: 'Ruta 2',
        monto: 300,
        descripcion: 'Ingreso'
      }
    ]);
  
    setHistorial([
      {
        id: 1,
        tipo: 'Ingreso',
        monto: 1200,
        descripcion: 'Abono cliente B',
        ruta: 'Ruta 1'
      },
      {
        id: 2,
        tipo: 'Egreso',
        monto: 200,
        descripcion: 'Compra material',
        ruta: 'Ruta 2'
      },
      {
        id: 3,
        tipo: 'Ingreso',
        monto: 450,
        descripcion: 'Abono cliente C',
        ruta: 'Ruta 3'
      }
    ]);
  }, []);
    

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Caja</Typography>

      <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Saldo actual:</Typography>
        <Typography variant="h5" color="primary">${saldo.toFixed(2)}</Typography>
      </Box>

      <Grid container spacing={2} mb={4}>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircle />}
            onClick={() => setModalIngresoOpen(true)}
          >
            Agregar Ingreso
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            startIcon={<RemoveCircle />}
            onClick={() => setModalEgresoOpen(true)}
          >
            Agregar Egreso
          </Button>
        </Grid>
      </Grid>

      {/* Movimientos por autorizar */}
      <Typography variant="h6" mb={1}>Ingresos por autorizar</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Supervisor</strong></TableCell>
              <TableCell><strong>Ruta</strong></TableCell>
              <TableCell><strong>Monto</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimientosPendientes.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell>{mov.supervisor}</TableCell>
                <TableCell>{mov.ruta}</TableCell>
                <TableCell>${mov.monto}</TableCell>
                <TableCell>{mov.descripcion}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleAutorizarIngreso(mov.id)}
                  >
                    Autorizar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDenegarIngreso(mov.id)}
                  >
                    Denegar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {movimientosPendientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay ingresos pendientes</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Historial */}
      <Typography variant="h6" gutterBottom>Últimos Ingresos / Egresos</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Monto</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Ruta</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historial.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell>{mov.tipo}</TableCell>
                <TableCell>${mov.monto}</TableCell>
                <TableCell>{mov.descripcion}</TableCell>
                <TableCell>{mov.ruta || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Modal Ingreso */}
      <Dialog open={modalIngresoOpen} onClose={() => setModalIngresoOpen(false)}>
        <DialogTitle>Agregar Ingreso</DialogTitle>
        <DialogContent>
        <TextField
        fullWidth
        label="Monto"
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        sx={{ mt: 2 }}
        />
        <TextField
        fullWidth
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        sx={{ mt: 2 }}
        />
        <TextField
        select
        fullWidth
        label="Ruta"
        value={nuevaRuta}
        onChange={(e) => setNuevaRuta(e.target.value)}
        sx={{ mt: 2 }}
        >
        {rutas.map((ruta) => (
          <MenuItem key={ruta.id} value={ruta.nombre}>
            {ruta.nombre}
          </MenuItem>
        ))}
        </TextField>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalIngresoOpen(false)}>Cancelar</Button>
        <Button variant="contained" onClick={() => {
        // Simular guardado
        setHistorial(prev => [...prev, {
          id: prev.length + 1,
          tipo: 'Ingreso',
          monto: parseFloat(monto),
          descripcion,
          ruta: nuevaRuta
        }]);
        setModalIngresoOpen(false);
        setMonto('');
        setDescripcion('');
        setNuevaRuta('');
        }}>Guardar</Button>
        </DialogActions>
      </Dialog>


      {/* Modal Egreso */}
      <Dialog open={modalEgresoOpen} onClose={() => setModalEgresoOpen(false)}>
        <DialogTitle>Agregar Egreso</DialogTitle>
        <DialogContent>
        <TextField
        fullWidth
        label="Monto"
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        sx={{ mt: 2 }}
        />
        <TextField
        fullWidth
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        sx={{ mt: 2 }}
        />
        <TextField
        select
        fullWidth
        label="Ruta"
        value={nuevaRuta}
        onChange={(e) => setNuevaRuta(e.target.value)}
        sx={{ mt: 2 }}
        >
        {rutas.map((ruta) => (
          <MenuItem key={ruta.id} value={ruta.nombre}>
            {ruta.nombre}
          </MenuItem>
        ))}
        </TextField>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalEgresoOpen(false)}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={() => {
        setHistorial(prev => [...prev, {
          id: prev.length + 1,
          tipo: 'Egreso',
          monto: parseFloat(monto),
          descripcion,
          ruta: nuevaRuta
        }]);
        setModalEgresoOpen(false);
        setMonto('');
        setDescripcion('');
        setNuevaRuta('');
        }}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
