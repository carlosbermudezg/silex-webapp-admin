import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, TextField, Pagination, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Box, InputLabel,
  FormControl, Select, MenuItem
} from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Oficinas() {
  const token = localStorage.getItem('token')

  const [oficinas, setOficinas] = React.useState([]);
  const [usuarios, setUsuarios] = React.useState([]);

  const [selectedOficina, setSelectedOficina] = React.useState(null);
  const [nuevaOficina, setNuevaOficina] = React.useState({
    nombre: '',
    direccion: '',
    telefono: '',
    userId: '',
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [openModalEditar, setOpenModalEditar] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [render, setRender] = React.useState(false);

  const handlePageChange = (_, value) => setPage(value);

  // Fetch oficinas y usuarios
  React.useEffect(() => {
    const fetchOficinasYUsuarios = async () => {
      try {
        const [oficinasRes, usuariosRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}oficinas/search?searchTerm=${searchTerm}&page=${page}&limit=10`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(`${import.meta.env.VITE_API_URL}usuarios?page=1&limit=10`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log(oficinasRes)
        setOficinas(oficinasRes.data.data);
        setTotalPages(oficinasRes.data.totalPages || 1);
        setUsuarios(usuariosRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Error al cargar datos');
      }
    };

    fetchOficinasYUsuarios();
  }, [render, page, searchTerm]);

  const handleAgregarOficina = async () => {
    const { nombre, direccion, telefono, userId } = nuevaOficina;
    if (!nombre || !direccion || !telefono || !userId) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}oficinas`, nuevaOficina, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Oficina creada correctamente ✅");
      setOpenModal(false);
      setNuevaOficina({ nombre: '', direccion: '', telefono: '', userId: '' });
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al crear oficina ❌");
    }
  };

  const handleEditarOficina = async () => {
    const { nombre, direccion, telefono, userId } = selectedOficina;
    if (!nombre || !direccion || !telefono || !userId) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}oficinas/${selectedOficina.id}`, selectedOficina, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Oficina actualizada correctamente ✅");
      setOpenModalEditar(false);
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al actualizar oficina ❌");
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container spacing={2}>
            <Grid item size={6}>
                <Typography variant='h5'>Oficinas</Typography>
                </Grid>
                <Grid item size={6}>
                    <Grid container spacing={1}>
                    <Grid item size={8}>
                        <TextField
                        label="Buscar oficina"
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
                        startIcon={<AddBusinessIcon />}
                        onClick={()=> setOpenModal(true)}
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
                        <TableCell>Nombre</TableCell>
                        <TableCell>Dirección</TableCell>
                        <TableCell>Teléfono</TableCell>
                        <TableCell>Responsable</TableCell>
                        <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {oficinas.map((oficina) => (
                        <TableRow key={oficina.id}>
                            <TableCell>{oficina.nombre}</TableCell>
                            <TableCell>{oficina.direccion}</TableCell>
                            <TableCell>{oficina.telefono}</TableCell>
                            <TableCell>{oficina.usuarios[0]?.nombre || '—'}</TableCell>
                            <TableCell>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                setSelectedOficina({
                                    ...oficina,
                                    userId: oficina.usuarios[0].id || '',
                                });
                                setOpenModalEditar(true);
                                }}
                            >
                                Editar
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
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

            {/* Modal Agregar */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Agregar nueva oficina</DialogTitle>
                <DialogContent>
                <TextField
                    margin="dense"
                    label="Nombre"
                    fullWidth
                    size="small"
                    value={nuevaOficina.nombre}
                    onChange={(e) => setNuevaOficina({ ...nuevaOficina, nombre: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Dirección"
                    fullWidth
                    size="small"
                    value={nuevaOficina.direccion}
                    onChange={(e) => setNuevaOficina({ ...nuevaOficina, direccion: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Teléfono"
                    fullWidth
                    size="small"
                    value={nuevaOficina.telefono}
                    onChange={(e) => setNuevaOficina({ ...nuevaOficina, telefono: e.target.value })}
                />
                <FormControl fullWidth size="small" margin="dense">
                    <InputLabel>Responsable</InputLabel>
                    <Select
                    value={nuevaOficina.userId}
                    label="Responsable"
                    onChange={(e) => setNuevaOficina({ ...nuevaOficina, userId: e.target.value })}
                    >
                    {usuarios.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                        {user.nombre}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                <Button onClick={handleAgregarOficina} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal Editar */}
            <Dialog open={openModalEditar} onClose={() => setOpenModalEditar(false)}>
                <DialogTitle>Editar oficina</DialogTitle>
                <DialogContent>
                <TextField
                    margin="dense"
                    label="Nombre"
                    fullWidth
                    size="small"
                    value={selectedOficina?.nombre || ''}
                    onChange={(e) => setSelectedOficina({ ...selectedOficina, nombre: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Dirección"
                    fullWidth
                    size="small"
                    value={selectedOficina?.direccion || ''}
                    onChange={(e) => setSelectedOficina({ ...selectedOficina, direccion: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Teléfono"
                    fullWidth
                    size="small"
                    value={selectedOficina?.telefono || ''}
                    onChange={(e) => setSelectedOficina({ ...selectedOficina, telefono: e.target.value })}
                />
                <FormControl fullWidth size="small" margin="dense">
                    <InputLabel>Responsable</InputLabel>
                    <Select
                    value={selectedOficina?.userId || ''}
                    label="Responsable"
                    onChange={(e) => setSelectedOficina({ ...selectedOficina, userId: e.target.value })}
                    >
                    {usuarios.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                        {user.nombre}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenModalEditar(false)}>Cancelar</Button>
                <Button onClick={handleEditarOficina} color="success">Actualizar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    </Box>
  );
}

Oficinas.requireAuth = true;
