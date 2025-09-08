import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, TextField, Pagination, Menu, MenuItem, Divider, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Box, InputLabel,
  FormControl, Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import { styled, alpha } from '@mui/material/styles';
import toast from 'react-hot-toast';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';


import {
    PersonAdd as PersonAddIcon,
    Archive as ArchiveIcon,
    Settings as SettingsIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

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

export default function Usuarios() {

  const [nuevoUsuario, setNuevoUsuario] = React.useState({
    nombre: '',
    correo: '',
    securityCode: '',
    contrasena: '',
    tipo: 'cobrador',
    permisoId: '',
    estado: 'activo',
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [openModalEditar, setOpenModalEditar] = React.useState(false);
  const [usuarios, setUsuarios] = React.useState([]);
  const [permisos, setPermisos] = React.useState([]);
  const [selectedUsuario, setSelectedUsuario] = React.useState(null);
  const [render, setRender] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const token = localStorage.getItem('token')

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handlePageChange = (_, value) => setPage(value);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}usuarios/search?searchTerm=${searchTerm}&page=${page}&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res)
        setUsuarios(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [render, page, searchTerm]);

  React.useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}permisos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermisos(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPermisos();
  }, []);

  const handleAgregarUsuario = async () => {
    const { nombre, correo, contrasena, tipo, permisoId, securityCode } = nuevoUsuario;
    if (!nombre || !correo || !contrasena || !tipo || !permisoId || !securityCode) {
      toast.error("Todos los campos son requeridos.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}usuarios`, nuevoUsuario, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Usuario creado ✅", { duration: 1000, position: 'bottom-center', });
      setOpenModal(false);
      setNuevoUsuario({
        nombre: '',
        correo: '',
        securityCode: '',
        contrasena: '',
        tipo: 'cobrador',
        permisoId: '',
        estado: 'activo',
      });
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al crear usuario ❌", { duration: 1000, position: 'bottom-center', });
    }
  };

  const handleEditarUsuario = async () => {
    const { nombre, correo, contrasena, tipo, permisoId, securityCode } = selectedUsuario;
    if (!nombre || !correo || !tipo || !permisoId) {
      toast.error("Todos los campos son requeridos.");
      return;
    }

    const body = {
      nombre,
      correo,
      contrasena: contrasena || '',
      securityCode: securityCode || '',
      tipo,
      permisoId,
      estado: selectedUsuario.estado,
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}usuarios/${selectedUsuario.id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Usuario actualizado ✅", { duration: 1000, position: 'bottom-center', });
      setOpenModalEditar(false);
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al actualizar usuario ❌", { duration: 1000, position: 'bottom-center', });
    }
  };

  const handleArchivarUsuario = async (usuarioId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}usuarios/${usuarioId}/archive`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Usuario archivado ✅", { duration: 1000, position: 'bottom-center', });
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al archivar usuario ❌", { duration: 1000, position: 'bottom-center', });
    }
  };

  const handleDesarchivarUsuario = async (usuarioId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}usuarios/${usuarioId}/desarchive`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Usuario desarchivado ✅", { duration: 1000, position: 'bottom-center', });
      setRender(prev => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al desarchivar usuario ❌", { duration: 1000, position: 'bottom-center', });
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container spacing={2}>
                <Grid item size={6}>
                <Typography variant='h5'>Usuarios</Typography>
                </Grid>
                <Grid item size={6}>
                    <Grid container spacing={1}>
                    <Grid item size={8}>
                        <TextField
                        label="Buscar usuario"
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
                        Agregar
                        </Button>
                    </Grid>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="tabla de usuarios">
                    <TableHead>
                        <TableRow>
                          <TableCell>Nombre y Apellidos</TableCell>
                          <TableCell>Correo</TableCell>
                          <TableCell>Rol</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                        <TableRow key={usuario.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{usuario.nombre}</TableCell>
                            <TableCell>{usuario.correo}</TableCell>
                            <TableCell>{usuario.tipo}</TableCell>
                            <TableCell><Chip label={usuario.estado}  color={ usuario.estado === 'activo' ? 'success' : 'warning' } /></TableCell>
                            <TableCell>
                              <Button
                                  size="small"
                                  variant="contained"
                                  disableElevation
                                  onClick={(e) => {
                                  setSelectedUsuario({...usuario, contrasena: "", securityCode: ""})
                                  handleClick(e);
                                  }}
                                  endIcon={<KeyboardArrowDownIcon />}
                              >
                                  <SettingsIcon />
                              </Button>
                              <StyledMenu
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                              >
                                  <MenuItem onClick={() =>  {
                                  setOpenModalEditar(true)
                                  handleClose() 
                                  }}>
                                  <EditIcon /> Editar
                                  </MenuItem>
                                  <Divider />
                                  {selectedUsuario?.estado === 'activo' && (
                                  <MenuItem onClick={() => { handleArchivarUsuario(selectedUsuario.id); handleClose(); }}>
                                      <ArchiveIcon /> Archivar
                                  </MenuItem>
                                  )}
                                  {selectedUsuario?.estado === 'archivado' && (
                                  <MenuItem onClick={() => { handleDesarchivarUsuario(selectedUsuario.id); handleClose(); }}>
                                      <ArchiveIcon /> Desarchivar
                                  </MenuItem>
                                  )}
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

            {/* Modal para agregar usuario */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Ingresar nuevo usuario</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete="off"
                    >
                    <TextField
                        size="small"
                        required
                        label="Nombre completo"
                        value={nuevoUsuario.nombre}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                    />
                    <TextField
                        size="small"
                        required
                        label="Correo"
                        value={nuevoUsuario.correo}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
                    />
                    <TextField
                        size="small"
                        required
                        label="Código de seguridad"
                        value={nuevoUsuario.securityCode}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, securityCode: e.target.value })}
                    />
                    <TextField
                        size="small"
                        required
                        label="Contraseña"
                        type="password"
                        value={nuevoUsuario.contrasena}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })}
                    />
                    <FormControl fullWidth size="small" sx={{ m: 1 }}>
                        <InputLabel>Tipo de usuario</InputLabel>
                        <Select
                        value={nuevoUsuario.tipo}
                        label="Tipo de usuario"
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, tipo: e.target.value })}
                        >
                        <MenuItem value="administrador">Administrador</MenuItem>
                        <MenuItem value="administrador_oficina">Administrador Oficina</MenuItem>
                        <MenuItem value="cobrador">Cobrador</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ m: 1 }}>
                        <InputLabel>Permiso</InputLabel>
                        <Select
                        value={nuevoUsuario.permisoId}
                        label="Permiso"
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, permisoId: e.target.value })}
                        >
                        {permisos.map((permiso) => (
                            <MenuItem key={permiso.id} value={permiso.id}>
                            {permiso.nombre}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Box>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                <Button onClick={handleAgregarUsuario} autoFocus color="success">
                    Agregar
                </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para editar usuario */}
            <Dialog open={openModalEditar} onClose={() => setOpenModalEditar(false)}>
                <DialogTitle>Editar usuario</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete="off"
                    >
                    <TextField
                        size="small"
                        required
                        label="Nombre completo"
                        value={selectedUsuario?.nombre || ''}
                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, nombre: e.target.value })}
                    />
                    <TextField
                        size="small"
                        required
                        label="Correo"
                        value={selectedUsuario?.correo || ''}
                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, correo: e.target.value })}
                    />
                    <TextField
                        size="small"
                        label="Código de seguridad"
                        value={selectedUsuario?.securityCode}
                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, securityCode: e.target.value })}
                    />
                    <TextField
                        size="small"
                        label="Contraseña"
                        type="password"
                        value={selectedUsuario?.contrasena}
                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, contrasena: e.target.value })}
                    />
                    <FormControl fullWidth size="small" sx={{ m: 1 }}>
                        <InputLabel>Tipo de usuario</InputLabel>
                        <Select
                        value={selectedUsuario?.tipo || ''}
                        label="Tipo de usuario"
                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, tipo: e.target.value })}
                        >
                        <MenuItem value="administrador">Administrador</MenuItem>
                        <MenuItem value="administrador_oficina">Administrador Oficina</MenuItem>
                        <MenuItem value="cobrador">Cobrador</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ m: 1 }}>
                        <InputLabel>Permiso</InputLabel>
                        <Select
                        value={selectedUsuario?.permisoId || ''}
                        label="Permiso"
                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, permisoId: e.target.value })}
                        >
                        {permisos.map((permiso) => (
                            <MenuItem key={permiso.id} value={permiso.id}>
                            {permiso.nombre}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Box>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenModalEditar(false)}>Cancelar</Button>
                <Button onClick={handleEditarUsuario} autoFocus color="success">
                    Actualizar
                </Button>
                </DialogActions>
            </Dialog>
        </Box>
    </Box>
  );
}

Usuarios.requireAuth = true;