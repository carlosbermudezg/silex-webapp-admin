'use client';
import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, TextField, Pagination, Menu,
  MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Paper, Grid, Chip
} from '@mui/material';

import {
  ShoppingBasketRounded,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

import { useLocalStorageValue } from '../../hooks/useLocalStorageValue';

import toast from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import { styled, alpha } from '@mui/material/styles';

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

export default function Gastos() {

  const oficinaId = useLocalStorageValue('oficinaId');
  const rutaId = useLocalStorageValue('rutaId');

  const [egresos, setEgresos] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [render, setRender] = React.useState(false);
  const [selectedEgreso, setSelectedEgreso] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalArchivo, setOpenModalArchivo] = React.useState(false);

  const open = Boolean(anchorEl);
  const token = localStorage.getItem('token');

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCloseModal = () => {
    setSelectedEgreso(null);
    setOpenModal(false);
  };
  const handleClickOpenArchivo = () => setOpenModalArchivo(true);
  const handleCloseModalArchivo = () => setOpenModalArchivo(false);
  const handlePageChange = (_, value) => setPage(value);

  const fetchEgresos = async (page, search) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}caja/allegresos?page=${page}&limit=10&searchTerm=${encodeURIComponent(search)}&oficinaId=${oficinaId}&rutaId=${rutaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setEgresos(data.egresos || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error cargando egresos:', err);
    }
  };

  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEgresos(page, searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, render, oficinaId, rutaId]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Typography variant='h5'>Gastos</Typography>
          </Grid>
          <Grid item size={6}>
            <Grid container spacing={2}>
              <Grid item size={8}>
                <TextField
                  label="Buscar gasto"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item size={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  startIcon={<ShoppingBasketRounded />}
                  onClick={() => {
                    setSelectedEgreso({ descripcion: '', monto: 0 });
                    setOpenModal(true);
                  }}
                  fullWidth
                >
                  Agregar
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item size={12}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {egresos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography>No se encontraron egresos.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    egresos.map((egreso) => {
                      let estado, color;
                      if(egreso.estado == 'pendiente'){
                        color = 'warning'
                        estado = 'Pendiente'
                      }
                      if(egreso.estado == 'aprobado'){
                        color = 'success'
                        estado = 'Aprobado'
                      }
                      if(egreso.estado == 'rechazado'){
                        color = 'error'
                        estado = 'Rechazado'
                      }
                      return(
                        <TableRow key={egreso.id}>
                          <TableCell>{egreso.id}</TableCell>
                          <TableCell>{egreso.descripcion}</TableCell>
                          <TableCell>{egreso.monto}</TableCell>
                          <TableCell>{new Date(egreso.createdAt).toLocaleString()}</TableCell>
                          <TableCell><Chip label={estado} color={color} /></TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="contained"
                              disableElevation
                              onClick={(e) => {
                                handleClick(e);
                                setSelectedEgreso(egreso);
                              }}
                              endIcon={<KeyboardArrowDownIcon />}
                            >
                              <SettingsIcon />
                            </Button>
                            <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
                              <MenuItem onClick={() => {
                                handleClose();
                                setOpenModal(true);
                              }}>
                                <EditIcon /> Editar
                              </MenuItem>
                            </StyledMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item size={12} sx={{ mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </Grid>

          {/* Modal Crear / Editar Egreso */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>{selectedEgreso?.id ? 'Editar Egreso' : 'Nuevo Egreso'}</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
                <TextField
                  label="Descripción"
                  value={selectedEgreso?.descripcion || ''}
                  onChange={(e) =>
                    setSelectedEgreso({ ...selectedEgreso, descripcion: e.target.value })
                  }
                  fullWidth
                  error={selectedEgreso?.descripcion?.trim() === ''}
                  helperText={selectedEgreso?.descripcion?.trim() === '' ? 'Este campo es requerido' : ''}
                />
                <TextField
                  label="Monto"
                  type="number"
                  value={selectedEgreso?.monto || 0}
                  onChange={(e) =>
                    setSelectedEgreso({ ...selectedEgreso, monto: Number(e.target.value) })
                  }
                  fullWidth
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button onClick={() => { /* Lógica para guardar */ }} color="primary">Guardar</Button>
            </DialogActions>
          </Dialog>

          {/* Modal Archivar (opcional, aún no implementado) */}
          <Dialog open={openModalArchivo} onClose={handleCloseModalArchivo}>
            <DialogTitle>Archivar egreso</DialogTitle>
            <DialogContent>
              <Typography>¿Está seguro que desea archivar este egreso?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModalArchivo}>Cancelar</Button>
              <Button onClick={handleCloseModalArchivo} autoFocus color="warning">Archivar</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Box>
    </Box>
  );
}

Gastos.requireAuth = true;