'use client';
import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, TextField, Pagination, Menu,
  MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Paper, Grid
} from '@mui/material';

import {
  ShoppingBasketRounded,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

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

export default function Productos() {
  const [productos, setProductos] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [render, setRender] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalArchivo, setOpenModalArchivo] = React.useState(false);

  const open = Boolean(anchorEl);
  const token = localStorage.getItem('token');

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setOpenModal(false);
  };
  const handleClickOpenArchivo = () => setOpenModalArchivo(true);
  const handleCloseModalArchivo = () => setOpenModalArchivo(false);
  const handlePageChange = (_, value) => setPage(value);

  const fetchProductos = async (page, search) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}productos/search?searchTerm=${encodeURIComponent(search)}&page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setProductos(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProductos(page, searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, render]);

  const handleSaveProduct = async () => {
    if (!selectedProduct || !token) return;

    const { nombre, precio, stock } = selectedProduct;

    if (!nombre || nombre.trim() === '') {
      toast.error('El nombre del producto es obligatorio');
      return;
    }

    if (precio < 0 || stock < 0) {
      toast.error('Precio y stock no pueden ser negativos');
      return;
    }

    try {
      const method = selectedProduct.id ? 'PUT' : 'POST';
      const url = selectedProduct.id
        ? `${import.meta.env.VITE_API_URL}productos/${selectedProduct.id}`
        : `${import.meta.env.VITE_API_URL}productos`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedProduct),
      });

      if (!res.ok) throw new Error('Error al guardar el producto');

      const updatedProduct = await res.json();

      if (method === 'POST') {
        setProductos((prev) => [updatedProduct, ...prev]);
      } else {
        setProductos((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
      }

      toast.success(`Producto ${method === 'POST' ? 'creado' : 'actualizado'} correctamente`);
      setOpenModal(false);
      setRender(!render);
    } catch (err) {
      console.error(err);
      toast.error('Hubo un error al guardar el producto');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Typography variant='h5'>Productos</Typography>
          </Grid>
          <Grid item size={6}>
            <Grid container spacing={2}>
              <Grid item size={8}>
                <TextField
                  label="Buscar producto"
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
                    setSelectedProduct({ nombre: '', precio: 0, stock: 0 });
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
                    <TableCell>Producto / Servicio</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography>No se encontraron productos.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    productos.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell>PR{producto.id}</TableCell>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell>{producto.createdAt}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            disableElevation
                            onClick={(e) => {
                              handleClick(e);
                              setSelectedProduct(producto);
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

          {/* Modal Crear / Editar Producto */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>{selectedProduct?.id ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
                <TextField
                  label="Nombre del Producto"
                  value={selectedProduct?.nombre || ''}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, nombre: e.target.value })
                  }
                  fullWidth
                  error={selectedProduct?.nombre?.trim() === ''}
                  helperText={
                    selectedProduct?.nombre?.trim() === '' ? 'Este campo es requerido' : ''
                  }
                />
                <TextField
                  label="Precio"
                  type="number"
                  value={selectedProduct?.precio || 0}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, precio: Number(e.target.value) })
                  }
                  fullWidth
                />
                <TextField
                  label="Stock"
                  type="number"
                  value={selectedProduct?.stock || 0}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, stock: Number(e.target.value) })
                  }
                  fullWidth
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button onClick={handleSaveProduct} color="primary">Guardar</Button>
            </DialogActions>
          </Dialog>

          {/* Modal Archivar (opcional, aún no implementado) */}
          <Dialog open={openModalArchivo} onClose={handleCloseModalArchivo}>
            <DialogTitle>Archivar producto</DialogTitle>
            <DialogContent>
              <Typography>¿Está seguro que desea archivar este producto?</Typography>
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

Productos.requireAuth = true;