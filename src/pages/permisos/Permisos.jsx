'use client';
import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, TextField, Pagination, Menu,
  MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Paper, Grid, Divider
} from '@mui/material';

import {
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ToggleOn
} from '@mui/icons-material';

import toast from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

export default function Permisos() {
  const [permisos, setPermisos] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedPermiso, setSelectedPermiso] = React.useState(null);

  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const token = localStorage.getItem('token');

  const handlePageChange = (_, value) => setPage(value);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleClickOpen = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const fetchProductos = async (page, search) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}permisos?searchTerm=${encodeURIComponent(search)}&page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data)
      setPermisos(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error cargando productos:', err);
      toast.error(err.response.data)
    }
  };

  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProductos(page, searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Typography variant='h5'>Permisos</Typography>
          </Grid>
          <Grid item size={6}>
            <Grid container spacing={2}>
              <Grid item size={8}>
                <TextField
                  label="Buscar permiso"
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
                  startIcon={<ToggleOn />}
                  onClick={() => { navigate('/ajustes/permisos/addpermiso') }}
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
                    <TableCell>Permiso</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permisos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography>No se encontraron permisos.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    permisos.map((permiso) => (
                      <TableRow key={permiso.id}>
                        <TableCell>PR{permiso.id}</TableCell>
                        <TableCell>{permiso.nombre}</TableCell>
                        <TableCell>{permiso.createdAt}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            disableElevation
                            onClick={(e) => {
                              handleClick(e)
                              setSelectedPermiso(permiso);
                            }}
                            endIcon={<KeyboardArrowDownIcon />}
                          >
                            <SettingsIcon />
                          </Button>
                          <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <MenuItem onClick={() => {
                              handleClose();
                              handleClickOpen(true);
                            }}>
                              <ArchiveIcon /> Archivar
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => {
                              navigate(`/ajustes/permisos/editpermiso/${selectedPermiso.id}`)
                            }}>
                              <EditIcon /> Editar
                            </MenuItem>
                          </StyledMenu>
                        </TableCell>
                      </TableRow>
                    ))
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

          {/* Modal Archivar (opcional, aún no implementado) */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Archivar permiso</DialogTitle>
            <DialogContent>
              <Typography>¿Está seguro que desea archivar este permiso?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button onClick={handleCloseModal} autoFocus color="warning">Archivar</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Box>
    </Box>
  );
}

Permisos.requireAuth = true;