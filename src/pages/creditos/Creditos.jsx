'use client';
import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, TextField, Pagination, Button,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Menu, MenuItem, Box, Paper, Grid, Chip
} from '@mui/material';

import {
  Settings as SettingsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Cancel
} from '@mui/icons-material';

import creditos1 from '../general/BANKA1';

import { Link } from 'react-router-dom';

import { styled, alpha } from '@mui/material/styles';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocalStorageValue } from '../../hooks/useLocalStorageValue';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.text.primary,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const Creditos = () => {

  const oficinaId = useLocalStorageValue('oficinaId');
  const rutaId = useLocalStorageValue('rutaId');

  const [creditos, setCreditos] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [render, setRender] = React.useState(false);

  const [openModal, setOpenModal] = React.useState(false);
  const [openModalAnular, setOpenModalAnular] = React.useState(false);
  const [selectedCredito, setSelectedCredito] = React.useState(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  creditos1.sort((a, b) => {
    const fechaA = new Date(`${a.fecha}T${a.hora}`);
    const fechaB = new Date(`${b.fecha}T${b.hora}`);
    return fechaA - fechaB; // Orden ascendente (más antiguo primero)
  });

  console.log(creditos1)


  const token = localStorage.getItem('token');

  const handlePageChange = (_, value) => setPage(value);
  
  const handleClick = (event, credito) => {
    setAnchorEl(event.currentTarget);
    setSelectedCredito(credito);
  };

  const handleCloseMenu = () => setAnchorEl(null);
  const handleCloseModal = () => {
    setSelectedCredito(null);
    setOpenModal(false);
  };

  const anularCredito = async ()=>{
    console.log(selectedCredito)
  }

  const fetchCreditos = async () => {
    try {
        console.log(page)
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}creditos?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&limit=10&oficinaId=${oficinaId}&rutaId=${rutaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res)
      setCreditos(res.data.creditos || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error cargando créditos:', err);
    }
  };

  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCreditos();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, render, oficinaId, rutaId]);

  const handleSaveCredito = async () => {
    if (!selectedCredito) return;

    const method = selectedCredito.id ? 'PUT' : 'POST';
    const url = selectedCredito.id
      ? `${import.meta.env.VITE_API_URL}creditos/${selectedCredito.id}`
      : `${import.meta.env.VITE_API_URL}creditos`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedCredito),
      });

      if (!res.ok) throw new Error('Error al guardar crédito');
      toast.success(`Crédito ${method === 'POST' ? 'creado' : 'actualizado'} correctamente`);
      setOpenModal(false);
      setRender(!render);
    } catch (err) {
      console.error(err);
      toast.error('Hubo un error al guardar el crédito');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item size={8}>
          <Typography variant='h5'>Créditos</Typography>
        </Grid>
        <Grid container size={4}>
        <Grid item size={12}>
          <TextField
            label="Buscar (estado, ruta, frecuencia)"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Grid>
        {/* <Grid item size={4}>
          <Button
            fullWidth
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => {
              setSelectedCredito({
                monto: '',
                frecuencia_pago: '',
                estado: '',
                fechaVencimiento: '',
                clienteId: '',
                usuarioId: '',
              });
              setOpenModal(true);
            }}
          >
            Agregar
          </Button>
        </Grid> */}
        </Grid>

        <Grid item size={12}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Ruta</TableCell>
                  <TableCell>Frecuencia</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>A pagar</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {creditos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography>No se encontraron créditos.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  creditos.map((credito) => {
                    console.log(credito)
                    let estado;
                    let color;
                    const fecha = new Date(credito.fechaVencimiento); // la fecha que quieres comparar
                    const ahora = new Date(); // fecha y hora actual
                    
                    if (credito.estado == 'impago'){
                        if (fecha >= ahora) {
                            color = 'warning'
                            estado = 'Impago'
                        } else {
                            color = 'error'
                            estado = 'Vencido'
                        }
                    }
                    if(credito.estado == 'pagado'){
                        color = 'success'
                        estado = 'Pagado'
                    }
                    return(
                    <TableRow key={credito.id}>
                      <TableCell>CR{credito.id}</TableCell>
                      <TableCell><Link to={`/clientes/perfil/${credito.clienteId}`}>{credito.cliente?.nombres}</Link></TableCell>
                      <TableCell>{credito.ruta?.nombre}</TableCell>
                      <TableCell>{credito.frecuencia_pago}</TableCell>
                      <TableCell>$ {(credito.monto)}</TableCell>
                      <TableCell>$ {(Number(credito.monto) + Number(credito.monto_interes_generado)).toFixed(2)}</TableCell>
                      <TableCell>$ {credito.saldo}</TableCell>
                      <TableCell>{new Date(credito.fechaVencimiento).toLocaleDateString()}</TableCell>
                      <TableCell><Chip label={estado} color={color} /></TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={(e) => handleClick(e, credito)}
                          endIcon={<KeyboardArrowDownIcon />}
                        >
                          <SettingsIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                    )
                  }))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item size={12}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Grid>
      </Grid>

      {/* Menú de acciones */}
      <StyledMenu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={() => {
          setOpenModalAnular(true);
          handleCloseMenu();
        }}>
          <Cancel/> Anular
        </MenuItem>
      </StyledMenu>

      {/* Modal Agregar / Editar Crédito */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCredito?.id ? 'Editar Crédito' : 'Nuevo Crédito'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Monto"
              fullWidth
              type="number"
              value={selectedCredito?.monto || ''}
              onChange={(e) => setSelectedCredito({ ...selectedCredito, monto: parseFloat(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Frecuencia de Pago"
              fullWidth
              value={selectedCredito?.frecuencia_pago || ''}
              onChange={(e) => setSelectedCredito({ ...selectedCredito, frecuencia_pago: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Estado"
              fullWidth
              value={selectedCredito?.estado || ''}
              onChange={(e) => setSelectedCredito({ ...selectedCredito, estado: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Fecha de Vencimiento"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={selectedCredito?.fechaVencimiento?.slice(0, 10) || ''}
              onChange={(e) => setSelectedCredito({ ...selectedCredito, fechaVencimiento: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Cliente ID"
              fullWidth
              value={selectedCredito?.clienteId || ''}
              onChange={(e) => setSelectedCredito({ ...selectedCredito, clienteId: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Usuario ID"
              fullWidth
              value={selectedCredito?.usuarioId || ''}
              onChange={(e) => setSelectedCredito({ ...selectedCredito, usuarioId: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSaveCredito} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Anular crédito */}
      <Dialog open={openModalAnular} onClose={()=> setOpenModalAnular(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Anular Crédito</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro que desea anular este crédito?</Typography>
          <Typography variant='caption' color='error'>Esta acción no se puede revertir</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpenModalAnular(false)}>Cancelar</Button>
          <Button variant='contained' onClick={()=> anularCredito()} color="error">Anular</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Creditos;

Creditos.requireAuth = true;