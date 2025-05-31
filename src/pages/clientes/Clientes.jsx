import * as React from 'react';
import axios from 'axios';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  Box, InputLabel, FormControl, Select, MenuItem, Paper, Divider,
  CircularProgress, Pagination
} from '@mui/material';

import toast from 'react-hot-toast';

import {
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';

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
    color: 'rgb(213, 218, 226)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px,' +
      'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,' +
      'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,' +
      'rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

export default function Clientes() {

  const oficinaId = useLocalStorageValue('oficinaId');
  const rutaId = useLocalStorageValue('rutaId');

  const [clientes, setClientes] = React.useState([]);
  const [rutas, setRutas] = React.useState([]);
  const [oficinas, setOficinas] = React.useState([]);
  const [selectedOficina, setSelectedOficina] = React.useState({})
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState(null); // Nuevo
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalArchivo, setOpenModalArchivo] = React.useState(false);
  const [nuevoCliente, setNuevoCliente] = React.useState({
    nombres: '',
    identificacion: '',
    telefono: '',
    direccion: '',
    coordenadasCasa: '',
    coordenadasCobro: '',
    rutaId: rutas?.id,
    fotos: [], // array de base64
  });

  const token = localStorage.getItem('token');
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handlePageChange = (_, value) => setPage(value);

  const convertirImagenesABase64 = (archivos) =>
    Promise.all(Array.from(archivos).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }));
  const handleFileInput = async (e) => {
    const archivos = e.target.files;
    const base64Images = await convertirImagenesABase64(archivos);
    setNuevoCliente(prev => ({
      ...prev,
      fotos: base64Images,
    }));
  };

  const handleGuardarCliente = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}clientes`, nuevoCliente, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Cliente creado:', res.data);
      toast.success('Cliente creado', { duration: 1000, position: 'bottom-center', });
      setOpenModal(false);
      setNuevoCliente({ nombres: '', identificacion: '', telefono: '', direccion: '', coordenadasCasa: '', coordenadasCobro: '', rutaId: '', fotos: [] });
      fetchClientes(0);
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      toast.error(err.response.data.error, { duration: 1000, position: 'bottom-center', });
    }
  };

  const handleClick = (event, cliente) => {
    setAnchorEl(event.currentTarget);
    setClienteSeleccionado(cliente);
  };

  const fetchClientes = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}clientes`, {
        params: {
          limit: 10,
          page: page,
          searchTerm,
          oficina: localStorage.getItem('oficinaId'),
          ruta: localStorage.getItem('rutaId')
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalPages(response.data.totalPages || 1);
      setClientes(response.data.data)
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOficinas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}oficinas?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await res.json();
      const data = result.data?.data || []; // <- esta línea corrige el acceso
      setOficinas(data);
    } catch (error) {
      console.error('Error al obtener oficinas:', error);
    }
  };

  
  const handleChangeOficina = (oficina)=>{
    setSelectedOficina(oficina)
    setRutas(oficina.rutas)
  }

  React.useEffect(() => {
    fetchClientes();
  }, [oficinaId, rutaId]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setClientes([]);
    fetchClientes(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => setAnchorEl(null);
  const handleClickOpen = () => {
    setOpenModal(true);
    fetchOficinas();
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleClickOpenArchivo = () => setOpenModalArchivo(true);
  const handleCloseModalArchivo = () => setOpenModalArchivo(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Typography variant='h5'>Clientes</Typography>
          </Grid>
          <Grid item size={6}>
            <Grid container spacing={1}>
              <Grid item size={8}>
                <TextField
                  label="Buscar cliente"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item size={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  startIcon={<PersonAddIcon />}
                  onClick={handleClickOpen}
                  fullWidth
                >
                  Agregar
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item size={12}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="tabla de clientes">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre y Apellidos</TableCell>
                    <TableCell>Identificación</TableCell>
                    <TableCell>Nacionalidad</TableCell>
                    <TableCell>Ruta</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Buro</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientes.map((cliente, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">CL{cliente.id}</TableCell>
                      <TableCell>{cliente.nombres}</TableCell>
                      <TableCell>{cliente.identificacion}</TableCell>
                      <TableCell>{cliente.nacionalidad}</TableCell>
                      <TableCell>{cliente.ruta?.nombre}</TableCell>
                      <TableCell>{cliente.telefono}</TableCell>
                      <TableCell>{cliente.direccion}</TableCell>
                      <TableCell>{cliente.buro}</TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={(event) => handleClick(event, cliente)}
                          endIcon={<KeyboardArrowDownIcon />}
                        >
                          <SettingsIcon />
                        </Button>
                        <StyledMenu
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                        >
                          <MenuItem key={cliente.id} onClick={() => navigate(`/clientes/perfil/${clienteSeleccionado.id}`)}>
                            <VisibilityIcon />
                            Perfil
                          </MenuItem>
                          {/* <Divider /> */}
                          {/* <MenuItem onClick={handleClickOpenArchivo}>
                            <ArchiveIcon />
                            Archivar
                          </MenuItem> */}
                        </StyledMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
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
        </Grid>

        {/* MODAL NUEVO CLIENTE */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>{"Ingresar nuevo cliente"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
                <TextField size="small" required label="Nombres completos" 
                  name="nombres"
                  value={nuevoCliente.nombres}
                  onChange={handleInputChange} />
                <TextField size="small" required label="Identificación"
                  name="identificacion"
                  value={nuevoCliente.identificacion}
                  onChange={handleInputChange}
                />
                <TextField size="small" required type="number" label="Teléfono"
                  name="telefono"
                  value={nuevoCliente.telefono}
                  onChange={handleInputChange}
                />
                <TextField size="small" required label="Dirección"
                  name="direccion"
                  value={nuevoCliente.direccion}
                  onChange={handleInputChange}
                />
                <TextField size="small" required label="Coordenadas de residencia"
                  name="coordenadasCasa"
                  value={nuevoCliente.coordenadasCasa}
                  onChange={handleInputChange}
                />
                <TextField size="small" required label="Coordenadas de cobro"
                  name="coordenadasCobro"
                  value={nuevoCliente.coordenadasCobro}
                  onChange={handleInputChange}
                />
                <FormControl sx={{ m: 1, width: '100%' }} size="small">
                  <InputLabel>Oficina</InputLabel>
                  <Select label="Oficina"
                    name="oficinaId"
                    value={selectedOficina.id}
                    >
                    {
                      oficinas?.map((oficina)=>{
                        return(
                          <MenuItem onClick={ ()=> handleChangeOficina(oficina) } value={oficina.id}>{oficina.nombre}</MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: '100%' }} size="small">
                  <InputLabel>Ruta</InputLabel>
                  <Select label="Ruta"
                    name="rutaId"
                    value={nuevoCliente.rutaId}
                    onChange={handleInputChange}
                  >
                    {
                      rutas?.map((ruta)=>{
                        return(
                          <MenuItem value={ruta.id}>{ruta.nombre}</MenuItem>
                        )
                      })
                    }
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  required
                  type="file"
                  label="Fotos"
                  inputProps={{ multiple: true }}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleFileInput}
                />
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleGuardarCliente} color="success" autoFocus>
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {/* MODAL ARCHIVAR CLIENTE */}
        <Dialog open={openModalArchivo} onClose={handleCloseModalArchivo}>
          <DialogTitle>{"Archivar cliente"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography>¿Está seguro que desea archivar este cliente?</Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModalArchivo}>Cancelar</Button>
            <Button onClick={handleCloseModalArchivo} color="warning" autoFocus>
              Archivar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

Clientes.requireAuth = true;