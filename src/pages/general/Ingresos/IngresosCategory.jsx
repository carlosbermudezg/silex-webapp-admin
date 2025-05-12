import { useState, useEffect } from "react"
import axios from "axios";
import toast from "react-hot-toast";
import { 
    Paper, 
    Pagination, 
    Grid, 
    Button, 
    Typography, 
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Box,
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Menu, MenuItem, Divider, Chip
} from "@mui/material";
import { Category, Edit, Archive, KeyboardArrowDown, List } from "@mui/icons-material";
import { styled, alpha } from '@mui/material/styles';
import dayjs from "dayjs";

const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color: 'rgb(55, 65, 81)',
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
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
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[300],
      }),
    },
  }));  

export default function IngresosCategory(){

    const [IngresoName, setIngresoName] = useState('');
    const [IngresoNameEdit, setIngresoNameEdit] = useState('');
    const [IngresoCategories, setIngresoCategories] = useState([]);
    const [addIngresoDialogOpen, setAddIngresoDialogOpen] = useState(false);
    const [editIngresoDialogOpen, setEditIngresoDialogOpen] = useState(false);
    const [render, setRender] = useState(false)
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');
    const [ totalPages, setTotalPages] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const token = localStorage.getItem('token');

    // Funciones
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleArchive = async(category)=>{
        const body = {
            status : !category.archivada
        }
        await axios.put(`${import.meta.env.VITE_API_URL}config/ingreso-categories/${category.id}/archive`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          }).then(()=>{
            category.archivada ? 
            toast.success('Categoria desarchivada.') :
            toast.success('Categoria archivada.')
            setRender(!render)
          }).catch((error)=>{
            console.log(error)
            toast.error(error.data)
          })
    }

    const getCategories = async ()=>{
        await axios.get(`${import.meta.env.VITE_API_URL}config/ingreso-categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page,
                limit,
                searchTerm
            }
          }).then((response)=>{
            setIngresoCategories(response.data.categorias)
            setTotalPages(response.data.totalPages)
          }).catch((error)=>{

            toast.error(error.data)
          })
    }

    const handleSaveIngresoCategory = async ()=>{
        const data = {
          nombre : IngresoName
        }
    
        await axios.post(`${import.meta.env.VITE_API_URL}config/ingreso-categories`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(()=>{
          setAddIngresoDialogOpen(false)
          toast.success('Categoria agregada con éxito.')
          setRender(!render)
          setIngresoName('')
        }).catch((error)=>{
          toast.error(error.data)
        })
    }

    const handleEditIngresoCategory = async ()=>{
        const data = {
          nombre : IngresoNameEdit,
          archivada: selectedCategory.archivada
        }
    
        await axios.put(`${import.meta.env.VITE_API_URL}config/ingreso-categories/${selectedCategory.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(()=>{
          setEditIngresoDialogOpen(false)
          toast.success('Categoria editada con éxito.')
          setRender(!render)
          setIngresoNameEdit('')
        }).catch((error)=>{
          toast.error(error.data)
        })
    }

    // UseEffects
    useEffect(()=>{
        getCategories()
    },[page, searchTerm, limit, render])

    return(
        <>
            <Grid container spacing={2}>
                <Grid item size={7}>
                <Typography variant='h5'>Categorias de Ingresos</Typography>
                </Grid>
                <Grid item size={3}>
                    <TextField 
                        size="small"
                        placeholder="Buscar categoria"
                        onChange={(e)=> setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item size={2}>
                <Button
                    variant="contained"
                    startIcon={<Category />}
                    onClick={() => setAddIngresoDialogOpen(true)}
                    sx={{ mb: 2 }}
                >
                    Agregar
                </Button>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table size="small">
                <TableHead>
                    <TableRow>
                    <TableCell><strong>Nombre</strong></TableCell>
                    <TableCell><strong>Fecha de creación</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {IngresoCategories?.map((cat) => {
                        const fechaOriginal = cat.createdAt;
                        const fechaFormateada = dayjs(fechaOriginal).format("YYYY-MM-DD HH:mm");
                        const status = cat.archivada ? 'Archivada' : 'Activa'
                        const color = cat.archivada ? 'warning' : 'success'
                        return(
                            <TableRow key={cat.id}>
                                <TableCell>
                                {cat.nombre}
                                </TableCell>
                                <TableCell>{fechaFormateada}</TableCell>
                                <TableCell><Chip label={status} color={color} /></TableCell>
                                <TableCell align="center">
                                    <div>
                                        <Button
                                            id="demo-customized-button"
                                            aria-controls={open ? 'demo-customized-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            variant="contained"
                                            disableElevation
                                            onClick={(e)=> {
                                                setSelectedCategory(cat)
                                                handleClick(e)
                                            }}
                                            endIcon={<KeyboardArrowDown />}
                                            >
                                            <List></List>
                                        </Button>
                                        <StyledMenu
                                            id="demo-customized-menu"
                                            MenuListProps={{
                                                'aria-labelledby': 'demo-customized-button',
                                            }}
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={()=>{
                                                setIngresoNameEdit(selectedCategory.nombre)
                                                setEditIngresoDialogOpen(true)
                                                handleClose()
                                            }} disableRipple>
                                                <Edit />
                                                Editar
                                            </MenuItem>
                                            <Divider sx={{ my: 0.5 }} />
                                            {selectedCategory?.archivada === false && (
                                                <MenuItem onClick={() => { handleArchive(selectedCategory); handleClose(); }}>
                                                    <Archive /> Archivar
                                                </MenuItem>
                                                )}
                                                {selectedCategory?.archivada === true && (
                                                <MenuItem onClick={() => { handleArchive(selectedCategory); handleClose(); }}>
                                                    <Archive /> Desarchivar
                                                </MenuItem>
                                            )}
                                        </StyledMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {IngresoCategories?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} align="center">
                        No hay categorias registradas
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                count={totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
                />
            </Box>
            {/* Modal para agregar categoria de Ingreso */}
            <Dialog open={addIngresoDialogOpen} onClose={() => setAddIngresoDialogOpen(false)}>
            <DialogTitle>Agregar categoria de Ingreso</DialogTitle>
            <DialogContent>
                <TextField
                fullWidth
                label="Nombre"
                value={IngresoName}
                onChange={(e) => setIngresoName(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setAddIngresoDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveIngresoCategory} variant="contained">
                Guardar
                </Button>
            </DialogActions>
            </Dialog>
            {/* Modal para editar categoria de Ingreso */}
            <Dialog open={editIngresoDialogOpen} onClose={() => setEditIngresoDialogOpen(false)}>
            <DialogTitle>Editar categoria de Ingreso</DialogTitle>
            <DialogContent>
                <TextField
                fullWidth
                label="Nombre"
                value={IngresoNameEdit}
                onChange={(e) => setIngresoNameEdit(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEditIngresoDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleEditIngresoCategory} variant="contained">
                Actualizar
                </Button>
            </DialogActions>
            </Dialog>
        </>
    )
}

IngresosCategory.requireAuth = true;