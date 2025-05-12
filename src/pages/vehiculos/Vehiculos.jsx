import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, TextField, Pagination, Dialog, DialogActions,
  DialogContent, DialogTitle, Box, InputLabel,
  FormControl, Select, MenuItem
} from '@mui/material';
import { TwoWheeler } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Vehiculos() {
  const token = localStorage.getItem('token');

  const [vehiculos, setVehiculos] = React.useState([]);
  const [usuarios, setUsuarios] = React.useState([]);
  const [fotosActualesEditar, setFotosActualesEditar] = React.useState([]);

  const [selectedVehiculo, setSelectedVehiculo] = React.useState(null);
  const [nuevasFotosEditar, setNuevasFotosEditar] = React.useState([]);

  console.log(fotosActualesEditar)
  console.log(nuevasFotosEditar)

  const [nuevoVehiculo, setNuevoVehiculo] = React.useState({
    placa: '',
    chasis: '',
    userId: '',
    fotos: [],
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [openModalEditar, setOpenModalEditar] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [render, setRender] = React.useState(false);

  const handlePageChange = (_, value) => setPage(value);

  const convertirImagenesABase64 = (files) => {
    return Promise.all(
      Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiculosRes, usuariosRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}vehiculos?searchTerm=${searchTerm}&page=${page}&limit=10`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(`${import.meta.env.VITE_API_URL}usuarios?page=1&limit=10`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setVehiculos(vehiculosRes.data.data);
        setTotalPages(vehiculosRes.data.totalPages || 1);
        setUsuarios(usuariosRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Error al cargar datos');
      }
    };

    fetchData();
  }, [render, page, searchTerm]);

  const handleAgregarVehiculo = async () => {
    const { placa, chasis, userId, fotos } = nuevoVehiculo;
    if (!placa || !chasis || !userId) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}vehiculos`, nuevoVehiculo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Vehículo creado correctamente ✅");
      setOpenModal(false);
      setNuevoVehiculo({ placa: '', chasis: '', userId: '', fotos: [] });
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al crear vehículo ❌");
    }
  };

  const handleEditarVehiculo = async () => {
    const { id, placa, chasis, userId } = selectedVehiculo;
    if (!placa || !chasis || !userId) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }
  
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}vehiculos/${id}`, {
        ...selectedVehiculo,
        nuevasFotos: nuevasFotosEditar,
        fotosExistentes: fotosActualesEditar,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success("Vehículo actualizado correctamente ✅");
      setOpenModalEditar(false);
      setNuevasFotosEditar([]);
      setFotosActualesEditar([]);
      setRender(prev => !prev);
    } catch (err) {
        console.log(err)
      toast.error(err?.response?.data?.message || "Error al actualizar vehículo ❌");
    }
  };  

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Typography variant='h5'>Vehículos</Typography>
          </Grid>
          <Grid item size={6}>
            <Grid container spacing={1}>
              <Grid item size={8}>
                <TextField
                  label="Buscar vehículo"
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
                  startIcon={<TwoWheeler />}
                  onClick={() => setOpenModal(true)}
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
                    <TableCell>Placa</TableCell>
                    <TableCell>Chasis</TableCell>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehiculos.map((vehiculo) => (
                    <TableRow key={vehiculo.id}>
                      <TableCell>{vehiculo.placa}</TableCell>
                      <TableCell>{vehiculo.chasis}</TableCell>
                      <TableCell>{vehiculo.responsableNombre || '—'}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setSelectedVehiculo({
                              ...vehiculo,
                              userId: vehiculo.userId || '',
                            });
                            setFotosActualesEditar(vehiculo.fotos || []); // suponiendo que tu API devuelve un array de fotos base64 o URLs
                            setNuevasFotosEditar([]);
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
          <DialogTitle>Agregar nuevo vehículo</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Placa"
              fullWidth
              size="small"
              value={nuevoVehiculo.placa}
              onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, placa: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Chasis"
              fullWidth
              size="small"
              value={nuevoVehiculo.chasis}
              onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, chasis: e.target.value })}
            />
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Responsable</InputLabel>
              <Select
                value={nuevoVehiculo.userId}
                label="Responsable"
                onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, userId: e.target.value })}
              >
                {usuarios.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 1 }}
            >
              Subir Fotos
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={async (e) => {
                  const base64Fotos = await convertirImagenesABase64(e.target.files);
                  setNuevoVehiculo((prev) => ({
                    ...prev,
                    fotos: [...prev.fotos, ...base64Fotos],
                  }));
                }}
              />
            </Button>

            {nuevoVehiculo.fotos.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {nuevoVehiculo.fotos.map((foto, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                        <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <Button
                        size="small"
                        color="error"
                        onClick={() => {
                            const nuevasFotos = [...nuevoVehiculo.fotos];
                            nuevasFotos.splice(index, 1);
                            setNuevoVehiculo({ ...nuevoVehiculo, fotos: nuevasFotos });
                        }}
                        sx={{ position: 'absolute', top: 0, right: 0, minWidth: 'auto', padding: '2px' }}
                        >
                        ×
                        </Button>
                    </Box>
                    ))}
                </Box>
            )}

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button onClick={handleAgregarVehiculo} color="primary">Guardar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal Editar */}
        <Dialog open={openModalEditar} onClose={() => setOpenModalEditar(false)}>
          <DialogTitle>Editar vehículo</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Placa"
              fullWidth
              size="small"
              value={selectedVehiculo?.placa || ''}
              onChange={(e) => setSelectedVehiculo({ ...selectedVehiculo, placa: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Chasis"
              fullWidth
              size="small"
              value={selectedVehiculo?.chasis || ''}
              onChange={(e) => setSelectedVehiculo({ ...selectedVehiculo, chasis: e.target.value })}
            />
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Responsable</InputLabel>
              <Select
                value={selectedVehiculo?.userId || ''}
                label="Responsable"
                onChange={(e) => setSelectedVehiculo({ ...selectedVehiculo, userId: e.target.value })}
              >
                {usuarios.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 1 }}
            >
              Agregar más fotos
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={async (e) => {
                  const base64Fotos = await convertirImagenesABase64(e.target.files);
                  setNuevasFotosEditar((prev) => [...prev, ...base64Fotos]);
                }}
              />
            </Button>

            {nuevasFotosEditar.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {nuevasFotosEditar.map((foto, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                        <img
                        src={foto}
                        alt={`Foto nueva ${index + 1}`}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <Button
                            size="small"
                            color="error"
                            onClick={() => {
                                setNuevasFotosEditar((prevFotos) => prevFotos.filter((_, i) => i !== index));
                            }}
                            sx={{ position: 'absolute', top: 0, right: 0, minWidth: 'auto', padding: '2px' }}
                        >
                            ×
                        </Button>
                    </Box>
                    ))}
                </Box>
            )}

            {fotosActualesEditar.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {fotosActualesEditar.map((foto, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                    <img
                    src={foto}
                    alt={`Foto actual ${index + 1}`}
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <Button
                        size="small"
                        color="error"
                        onClick={() => {
                            setFotosActualesEditar((prevFotos) => prevFotos.filter((_, i) => i !== index));
                        }}
                        sx={{ position: 'absolute', top: 0, right: 0, minWidth: 'auto', padding: '2px' }}
                    >
                        ×
                    </Button>

                </Box>
                ))}
            </Box>
            )}

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModalEditar(false)}>Cancelar</Button>
            <Button onClick={handleEditarVehiculo} color="success">Actualizar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

Vehiculos.requireAuth = true;