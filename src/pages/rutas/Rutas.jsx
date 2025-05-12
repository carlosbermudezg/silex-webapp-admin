import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow, IconButton,
  Typography, Button, TextField, Pagination, Menu, MenuItem, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Box, InputLabel,
  FormControl, Select
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';
import toast from 'react-hot-toast';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { jwtDecode } from 'jwt-decode';

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

export default function Rutas() {
  const token = localStorage.getItem('token')

  const [rutas, setRutas] = React.useState([]);
  const [usuarios, setUsuarios] = React.useState([]);
  const [oficinas, setOficinas] = React.useState([]);
  const [productos, setProductos] = React.useState([]);
  const [nuevaRuta, setNuevaRuta] = React.useState({
    nombre: '',
    oficinaId: '',
    userId: '',
    productoId: []
  });
  const [selectedRuta, setSelectedRuta] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalEditar, setOpenModalEditar] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [render, setRender] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const open = Boolean(anchorEl);

  const decoded = jwtDecode(token)

  const handleClick = (event, ruta) => {
    setSelectedRuta(ruta);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handlePageChange = (_, value) => setPage(value);

  React.useEffect(() => {
    const fetchRutas = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}rutas/search?searchTerm=${searchTerm}&page=${page}&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRutas(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRutas();
  }, [render, page, searchTerm]);

  React.useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}usuarios/search?searchTerm=&page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchOficinas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}oficinas/all?page=1&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data.data.data)
        setOficinas(res.data.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProductos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}productos?page=1&limit=500`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data)
        setProductos(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsuarios();
    fetchOficinas();
    fetchProductos();
  }, []);

  const handleAgregarRuta = async () => {
    if (!nuevaRuta.nombre || !nuevaRuta.oficinaId || !nuevaRuta.userId || !nuevaRuta.productoId) {
      toast.error("Todos los campos son requeridos.");
      return;
    }

    const payload = {
      ...nuevaRuta,
      userCreate: decoded.userId,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}rutas`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Ruta creada correctamente ✅");
      setOpenModal(false);
      setNuevaRuta({ nombre: '', oficinaId: '', userId: '', productoId: [] });
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al crear ruta ❌");
    }
  };

  const handleEditarRuta = async () => {
    if (!selectedRuta?.nombre || !selectedRuta?.oficinaId || !selectedRuta?.userId) {
      toast.error("Todos los campos son requeridos.");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}rutas/${selectedRuta.id}`, selectedRuta, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Ruta actualizada correctamente ✅");
      setOpenModalEditar(false);
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al actualizar ruta ❌");
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
        <Grid item size={6}>
            <Typography variant='h5'>Rutas</Typography>
            </Grid>
            <Grid item size={6}>
                <Grid container spacing={1}>
                <Grid item size={8}>
                    <TextField
                    label="Buscar rutas"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e)=> setSearchTerm(e.target.value)}
                    fullWidth
                    />
                </Grid>
                <Grid item size={4}>
                    <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    startIcon={<PersonAddIcon />}
                    onClick={()=> setOpenModal(true)}
                    fullWidth
                    >
                    Nueva Ruta
                    </Button>
                </Grid>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <TableContainer component={Paper}>
                <Table size="small">
                <TableHead>
                    <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Oficina</TableCell>
                    <TableCell>Asignado a</TableCell>
                    <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rutas?.map((ruta) => (
                    <TableRow key={ruta.id}>
                        <TableCell>{ruta.nombre}</TableCell>
                        <TableCell>{ruta.oficina?.nombre}</TableCell>
                        <TableCell>{ruta.usuario?.nombre}</TableCell>
                        <TableCell>
                        <Button
                            size="small"
                            variant="contained"
                            disableElevation
                            onClick={(e) => handleClick(e, ruta)}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            <SettingsIcon />
                        </Button>
                        <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <MenuItem onClick={() => {
                            setOpenModalEditar(true);
                            handleClose();
                            }}>
                            <EditIcon /> Editar
                            </MenuItem>
                        </StyledMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
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

        {/* Modal crear */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Nueva Ruta</DialogTitle>
            <DialogContent>
            <DialogContentText>
                <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete="off">
                <TextField
                    size="small"
                    label="Nombre"
                    value={nuevaRuta.nombre}
                    onChange={(e) => setNuevaRuta({ ...nuevaRuta, nombre: e.target.value })}
                />
                <FormControl fullWidth size="small" sx={{ m: 1 }}>
                    <InputLabel>Usuario</InputLabel>
                    <Select
                    value={nuevaRuta.userId}
                    label="Usuario"
                    onChange={(e) => setNuevaRuta({ ...nuevaRuta, userId: e.target.value })}
                    >
                    {usuarios.map(user => (
                        <MenuItem key={user.id} value={user.id}>{user.nombre}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={{ m: 1 }}>
                    <InputLabel>Oficina</InputLabel>
                    <Select
                    value={nuevaRuta.oficinaId}
                    label="Oficina"
                    onChange={(e) => setNuevaRuta({ ...nuevaRuta, oficinaId: e.target.value })}
                    >
                    {oficinas.map(oficina => (
                        <MenuItem key={oficina.id} value={oficina.id}>{oficina.nombre}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={{ m: 1 }}>
                    <InputLabel>Producto</InputLabel>
                    <Select
                    value={nuevaRuta.productoId}
                    label="Producto"
                    onChange={(e) => setNuevaRuta({ ...nuevaRuta, productoId: [e.target.value] })}
                    >
                    {productos.map(producto => (
                        <MenuItem key={producto.id} value={producto.id}>{producto.nombre}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button onClick={handleAgregarRuta} autoFocus color="success">Agregar</Button>
            </DialogActions>
        </Dialog>

        {/* Modal editar */}
        <Dialog open={openModalEditar} onClose={() => setOpenModalEditar(false)}>
            <DialogTitle>Editar Ruta</DialogTitle>
            <DialogContent>
            <DialogContentText>
                <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
                <TextField
                    size="small"
                    label="Nombre"
                    value={selectedRuta?.nombre || ''}
                    onChange={(e) => setSelectedRuta({ ...selectedRuta, nombre: e.target.value })}
                />
                <FormControl fullWidth size="small" sx={{ m: 1 }}>
                    <InputLabel>Usuario</InputLabel>
                    <Select
                    value={selectedRuta?.userId || ''}
                    label="Usuario"
                    onChange={(e) => setSelectedRuta({ ...selectedRuta, userId: e.target.value })}
                    >
                    {usuarios.map(user => (
                        <MenuItem key={user.id} value={user.id}>{user.nombre}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={{ m: 1 }}>
                    <InputLabel>Oficina</InputLabel>
                    <Select
                    value={selectedRuta?.oficinaId || ''}
                    label="Oficina"
                    onChange={(e) => setSelectedRuta({ ...selectedRuta, oficinaId: e.target.value })}
                    >
                    {oficinas.map(oficina => (
                        <MenuItem key={oficina.id} value={oficina.id}>{oficina.nombre}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenModalEditar(false)}>Cancelar</Button>
            <Button onClick={handleEditarRuta} autoFocus color="success">Actualizar</Button>
            </DialogActions>
        </Dialog>
        </Box>
    </Box>
  );
}

Rutas.requireAuth = true;