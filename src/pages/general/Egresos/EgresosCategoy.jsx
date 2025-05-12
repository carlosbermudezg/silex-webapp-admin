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

export default function EgresosCategory(){

    const [egresoName, setEgresoName] = useState('');
    const [egresoNameEdit, setEgresoNameEdit] = useState('');
    const [egresoCategories, setEgresoCategories] = useState([]);
    const [addEgresoDialogOpen, setAddEgresoDialogOpen] = useState(false);
    const [editEgresoDialogOpen, setEditEgresoDialogOpen] = useState(false);
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
        await axios.put(`${import.meta.env.VITE_API_URL}config/gasto-categories/${category.id}/archive`, body, {
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
        await axios.get(`${import.meta.env.VITE_API_URL}config/gasto-categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page,
                limit,
                searchTerm
            }
          }).then((response)=>{
            setEgresoCategories(response.data.categorias)
            setTotalPages(response.data.totalPages)
          }).catch((error)=>{

            toast.error(error.data)
          })
    }

    const handleSaveEgresoCategory = async ()=>{
        const data = {
          nombre : egresoName
        }
    
        await axios.post(`${import.meta.env.VITE_API_URL}config/gasto-categories`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(()=>{
          setAddEgresoDialogOpen(false)
          toast.success('Categoria agregada con éxito.')
          setRender(!render)
          setEgresoName('')
        }).catch((error)=>{
          toast.error(error.data)
        })
    }

    const handleEditEgresoCategory = async ()=>{
        const data = {
          nombre : egresoNameEdit,
          archivada: selectedCategory.archivada
        }
    
        await axios.put(`${import.meta.env.VITE_API_URL}config/gasto-categories/${selectedCategory.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(()=>{
          setEditEgresoDialogOpen(false)
          toast.success('Categoria editada con éxito.')
          setRender(!render)
          setEgresoNameEdit('')
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
                <Typography variant='h5'>Categorias de Egresos</Typography>
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
                    onClick={() => setAddEgresoDialogOpen(true)}
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
                    {egresoCategories?.map((cat) => {
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
                                                setEgresoNameEdit(selectedCategory.nombre)
                                                setEditEgresoDialogOpen(true)
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
                    {egresoCategories?.length === 0 && (
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
            {/* Modal para agregar categoria de egreso */}
            <Dialog open={addEgresoDialogOpen} onClose={() => setAddEgresoDialogOpen(false)}>
            <DialogTitle>Agregar categoria de egreso</DialogTitle>
            <DialogContent>
                <TextField
                fullWidth
                label="Nombre"
                value={egresoName}
                onChange={(e) => setEgresoName(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setAddEgresoDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveEgresoCategory} variant="contained">
                Guardar
                </Button>
            </DialogActions>
            </Dialog>
            {/* Modal para editar categoria de egreso */}
            <Dialog open={editEgresoDialogOpen} onClose={() => setEditEgresoDialogOpen(false)}>
            <DialogTitle>Editar categoria de egreso</DialogTitle>
            <DialogContent>
                <TextField
                fullWidth
                label="Nombre"
                value={egresoNameEdit}
                onChange={(e) => setEgresoNameEdit(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEditEgresoDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleEditEgresoCategory} variant="contained">
                Actualizar
                </Button>
            </DialogActions>
            </Dialog>
        </>
    )
}

EgresosCategory.requireAuth = true;