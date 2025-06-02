'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem,
  CircularProgress, Chip, Pagination, Menu, Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

import { AddCircle, RemoveCircle, Archive, FileCopy,
   Settings, CheckCircle,
   Cancel
  } from '@mui/icons-material';

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

import toast from 'react-hot-toast';

import dayjs from 'dayjs';

import axios from 'axios'
import { useLocalStorageValue } from '../../hooks/useLocalStorageValue';

export default function Caja() {
  const [movimientosPendientes, setMovimientosPendientes] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [rutas, setRutas] = useState([
    { id: 1, nombre: 'Ruta 1' },
    { id: 2, nombre: 'Ruta 2' },
    { id: 3, nombre: 'Ruta 3' },
  ]);
  const [modalIngresoOpen, setModalIngresoOpen] = useState(false);
  const [modalEgresoOpen, setModalEgresoOpen] = useState(false);
  const [modalAutorizarOpen, setModalAutorizarOpen] = useState(false);
  const [modalDenegarOpen, setModalDenegarOpen] = useState(false);
  const [modalAnularOpen, setModalAnularOpen] = useState(false);
  const [motivoAnulacion, setMotivoAnulacion] = useState('')
  const [abonoSelected, setAbonoSelected] = useState({});
  const [gastoSelected, setGastoSelected] = useState({});
  const [modalCierreOpen, setModalCierreOpen] = useState(false);
  const [bloqueoCaja, setBloqueoCaja] = useState(null);
  const [nuevaRuta, setNuevaRuta] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(false);
  const [egresosTurno, setEgresosTurno] = useState([])
  const [abonosTurno, setAbonosTurno] = useState([])

  const [egresosCategory, setEgresosCategory] = useState([]);
  const [selectedEgresoCategory, setSelectedEgresoCategory] = useState({})
  const [montoEgreso, setMontoEgreso] = useState(0);
  const [descripcionEgreso, setDescripcionEgreso] = useState('')

  const [ingresosCategory, setIngresosCategory] = useState([]);
  const [selectedIngresoCategory, setSelectedIngresoCategory] = useState({})
  const [montoIngreso, setMontoIngreso] = useState(0);
  const [descripcionIngreso, setDescripcionIngreso] = useState('')

  const [caja, setCaja] = useState({});
  const [turno, setTurno] = useState({id: 0});
  const [movimientos, setMovimientos] = useState([]);
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const [pageAbonos, setPageAbonos] = useState(1); // Establecemos 10 registros por defecto
  const [totalPagesAbonos, setTotalPagesAbonos] = useState(0); // Total de páginas
  const [pageEgresos, setPageEgresos] = useState(1); // Establecemos 10 registros por defecto
  const [totalPagesEgresos, setTotalPagesEgresos] = useState(0); // Total de páginas
  const [modalFactura, setModalFactura] = useState(false)

  const token = localStorage.getItem('token');
  const API_BASE = `${import.meta.env.VITE_API_URL}`;
  const rutaId = useLocalStorageValue('rutaId');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);

  const handleClick = (event, egreso) => {
    setAnchorEl(event.currentTarget);
    setGastoSelected(egreso)
  };

  const handleAbono = (event, egreso) => {
    setAnchorEl2(event.currentTarget);
    setAbonoSelected(egreso)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const Autorizar = async()=> {
    await axios.put(`${API_BASE}caja/aprobar-egreso/${gastoSelected.id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response)=>{
      console.log(response)
      setModalAutorizarOpen(false)
      setRender(!render)
      toast.success('El egreso ha sido autorizado con éxito', {position:'bottom-center'})
    }).catch((error)=>{
      console.log(error)
      setModalAutorizarOpen(false)
      toast.error('Ha ocurrido un error al autorizar el gasto', {position:'bottom-center'})
    })
  }

  const Denegar = async()=>{
    await axios.put(`${API_BASE}caja/rechazar-egreso/${gastoSelected.id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response)=>{
      console.log(response)
      setModalDenegarOpen(false)
      setRender(!render)
      toast.success('El egreso ha sido autorizado con éxito', {position:'bottom-center'})
    }).catch((error)=>{
      console.log(error)
      setModalDenegarOpen(false)
      toast.error('Ha ocurrido un error al autorizar el gasto', {position:'bottom-center'})
    })
  }

  const anularPago = async()=>{
    if(!motivoAnulacion || !abonoSelected){
      return toast.error('Todos los campos son requeridos', {position:'bottom-center'})
    }
    await axios.post(`${API_BASE}caja/anular-abono/`, {
      id: abonoSelected.id,
      motivo: motivoAnulacion
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response)=>{
      console.log(response)
      setModalAnularOpen(false)
      setRender(!render)
      toast.success('El pago ha sido anulado con éxito', {position:'bottom-center'})
    }).catch((error)=>{
      console.log(error)
      setModalAnularOpen(false)
      toast.error('Ha ocurrido un error al anular el pago', {position:'bottom-center'})
    })
  }

  // Obtener las categorias de egresos
  const getEgresosCategory = async () => {
    try {
      const res = await axios.get(`${API_BASE}config/gasto-categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEgresosCategory(res.data.categorias); // Los movimientos de la página actual
    } catch (err) {
      console.error(err);
    }
  };

  // Obtener las categorias de egresos
  const getEgresosByTurno = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}caja/egresos-turno/${id}?page=${pageEgresos}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEgresosTurno(res.data.data); // Los movimientos de la página actual
      setTotalPagesEgresos(res.data.totalPages)
    } catch (err) {
      // console.error(err);
    }
  };

  // Obtener las categorias de egresos
  const getAbonosByTurno = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}caja/abonos-turno/${id}?page=${pageAbonos}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTotalPagesAbonos(res.data.totalPages)
      setAbonosTurno(res.data.data); // Los movimientos de la página actual
    } catch (err) {
      // console.error(err);
    }
  };

  // Obtener las categorias de ingresos
  const getIngresosCategory = async () => {
    try {
      const res = await axios.get(`${API_BASE}config/ingreso-categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngresosCategory(res.data.categorias); // Los movimientos de la página actual
    } catch (err) {
      console.error(err);
    }
  };

  const addEgreso = async()=>{
    const egreso = {
      descripcion: descripcionEgreso,
      monto: montoEgreso,
      gastoCategoryId: selectedEgresoCategory.id,
      cajaId: caja.id,
      turnoId: turno.id
  }
  console.log(egreso)
    try {
      const res = await axios.post(`${API_BASE}caja/egreso-out`, egreso, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res)
      setSelectedEgresoCategory({});
      setDescripcionEgreso('')
      setMontoEgreso(0)
      setModalEgresoOpen(false)
      setRender(!render)
      toast.success('Egreso agregado correctamente.', {position:'bottom-center'})
    } catch (err) {
      toast.error(err.response.data.error, {position:'bottom-center'});
    }
  }

  const addIngreso = async()=>{
    const ingreso = {
      descripcion: descripcionIngreso,
      monto: montoIngreso,
      ingresoCategoryId: selectedIngresoCategory.id,
      cajaId: caja.id,
      turnoId: turno.id
  }
  console.log(ingreso)
    try {
      const res = await axios.post(`${API_BASE}caja/ingreso`, ingreso, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res)
      setSelectedIngresoCategory({});
      setDescripcionIngreso('')
      setMontoIngreso(0)
      setModalIngresoOpen(false)
      setRender(!render)
      toast.success('Ingreso agregado correctamente.', {position:'bottom-center'})
    } catch (err) {
      toast.error(err.response.data.error, {position:'bottom-center'})
    }
  }

  // Obtener los movimientos para la caja
  const getMovimientos = async (id, page, limit) => {
    try {
      const res = await axios.get(`${API_BASE}caja/movimientos`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          turnoId : id,
          page: page, // El backend espera que la página comience en 1
          limit,
        },
      });
      setMovimientos(res.data.data); // Los movimientos de la página actual
      setTotalPages(res.data.totalPages); // Total de páginas
    } catch (err) {
      // console.error(err);
    }
  };

  // Obtener el estado de la caja
  const obtenerTurno = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}caja/turno/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTurno(response.data)
    } catch (err) {
      setTurno({})
      setMovimientos([])
      setEgresosTurno([])
    }
  };

  // Obtener el estado de la caja
  const obtenerCaja = async () => {
    try {
      const response = await axios.get(`${API_BASE}caja/ruta/${rutaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await obtenerTurno(response.data.id)
      setCaja(response.data)
    } catch (err) {
      toast.error(err.response.data)
    }
  };

  const bloquearCaja = async (estado) => {
    if(!turno.id) return
    await axios.post(`${import.meta.env.VITE_API_URL}caja/bloquear-caja`, {cajaId : caja.id, estado : estado}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response)=>{
      // console.log(response)
      setRender(!render)
    }).catch(error => console.log(error))
  }

  const abrirCaja = async()=>{
    if(turno.id) return
    await axios.post(`${import.meta.env.VITE_API_URL}caja/abrir-caja`, {cajaId : caja.id}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response)=>{
      // console.log(response)
      setRender(!render)
      toast.success('La caja ha sido abierta con éxito', {position:'bottom-center'})
    }).catch(error => console.log(error))
  }

  const cerrarCaja = async()=>{
    if(!turno.id) return
    await axios.post(`${import.meta.env.VITE_API_URL}caja/cerrar-caja`, {cajaId : caja.id}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response)=>{
      // console.log(response)
      setModalCierreOpen(false)
      setRender(!render)
      toast.success('La caja ha sido cerrada con éxito', {position:'bottom-center'})
    }).catch(error => console.log(error))
  }

  const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const init = async()=>{
      if (!rutaId) return
      setLoading(true)
      await obtenerCaja()
      setLoading(false)
    }
    init()
  }, [rutaId, render]);

  useEffect(()=>{
    const get = async()=>{
      await getMovimientos(turno.id, page, 10)
    }
    get()
  },[page, turno])

  useEffect(()=>{
    const get = async()=>{
      await getAbonosByTurno(turno.id)
    }
    get()
  },[pageAbonos, turno])

  useEffect(()=>{
    const get = async()=>{
      await getEgresosByTurno(turno.id)
    }
    get()
  },[pageEgresos, turno])

  useEffect(()=>{
    getEgresosCategory();
    getIngresosCategory();
  },[])
    
  return (
    <Box p={4}>
      {
        loading ? 
        (<Grid container spacing={2} size={12} sx={{justifyContent:'center', alignItems:'center', paddingBottom:3}}>
          <Typography>Selecciona una ruta</Typography><CircularProgress />
        </Grid>) :
        (<Grid container spacing={2} size={12}>
          <Grid item size={6}>
            <Typography variant="h4" mb={2}>Caja - {caja.ruta_nombre}</Typography>
          </Grid>
          <Grid item size={2} sx={{textAlign:'end'}}>
            <Typography variant="h6"><Chip label={capitalizar(caja.estado)} color={caja.estado === 'abierta' ? 'success' : 'error'} /></Typography>
          </Grid>
          <Grid item size={2} sx={{textAlign:'end'}}>
            <Typography variant="h6">Saldo actual:</Typography>
          </Grid>
          <Grid item size={2} sx={{textAlign:'center'}}>
            <Typography variant="h5" color="primary">${caja.saldoActual.toLocaleString('es-ES',  {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</Typography>
          </Grid>
        </Grid>)
      }

      <Grid container spacing={2} mb={4}>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircle />}
            onClick={() => setModalIngresoOpen(true)}
          >
            Agregar Ingreso
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            startIcon={<RemoveCircle />}
            onClick={() => setModalEgresoOpen(true)}
          >
            Agregar Egreso
          </Button>
        </Grid>
        <Grid item>
          {
            caja.estado == 'abierta' ?
            (<Button
              variant="contained"
              color="primary"
              startIcon={<RemoveCircle />}
              onClick={() => bloquearCaja('cerrada')}
            >
              Bloquear Caja
            </Button>) :
            (<Button
              disabled= {!turno.id}
              variant="contained"
              color="primary"
              startIcon={<RemoveCircle />}
              onClick={() => bloquearCaja('abierta')}
            >
              Desbloquear Caja
            </Button>)
          }
        </Grid>
        <Grid item>
          {
            !turno.id ? 
              <Button
                variant="contained"
                color="success"
                startIcon={<RemoveCircle />}
                onClick={() => abrirCaja()}
              >
                Abrir Caja
              </Button>
            :
              <Button
                variant="contained"
                color="warning"
                startIcon={<RemoveCircle />}
                onClick={() => setModalCierreOpen(true)}
              >
                Cerrar Caja
              </Button>
          }
        </Grid>
      </Grid>

      {/* Movimientos por autorizar */}
      {/* <Typography variant="h6" mb={1}>Ingresos por autorizar</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Supervisor</strong></TableCell>
              <TableCell><strong>Ruta</strong></TableCell>
              <TableCell><strong>Monto</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimientosPendientes.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell>{mov.supervisor}</TableCell>
                <TableCell>{mov.ruta}</TableCell>
                <TableCell>${mov.monto}</TableCell>
                <TableCell>{mov.descripcion}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleAutorizarIngreso(mov.id)}
                  >
                    Autorizar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDenegarIngreso(mov.id)}
                  >
                    Denegar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {movimientosPendientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay ingresos pendientes</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer> */}

      {/* Gastos del turno */}
      <Typography variant="h6" mb={1}>Gastos del turno</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Fecha y Hora</strong></TableCell>
              <TableCell><strong>Categoria</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Creado por</strong></TableCell>
              <TableCell><strong>Admin</strong></TableCell>
              <TableCell sx={{width: '130px'}}><strong>Monto</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {egresosTurno?.map((egreso) => {
              const fechaOriginal = egreso.fecha_creacion;
              const fechaFormateada = dayjs(fechaOriginal).format("YYYY-MM-DD HH:mm");
              const estado = capitalizar(egreso.estado)
              let color
              if(egreso.estado === 'aprobado'){
                color = 'success'
              } else if(egreso.estado === 'pendiente'){
                color = 'warning'
              } else {
                color = 'error'
              }
              return(
                <TableRow key={egreso.id}>
                  <TableCell>{fechaFormateada}</TableCell>
                  <TableCell>{egreso.categoria.nombre}</TableCell>
                  <TableCell>{egreso.descripcion}</TableCell>
                  <TableCell>{egreso.creado_por.nombre}</TableCell>
                  <TableCell>{egreso.usuario_estado?.nombre}</TableCell>
                  <TableCell>$ {egreso.monto.toLocaleString('es-ES',  {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</TableCell>
                  <TableCell><Chip label={estado} color={color} /></TableCell>
                  <TableCell align="center">
                    {
                      estado === 'Pendiente' ? 
                      <div>
                        <Button
                          id="demo-customized-button"
                          aria-controls={open ? 'demo-customized-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          variant="contained"
                          disableElevation
                          onClick={(event)=> handleClick(event, egreso)}
                          size='small'
                        >
                          <Settings></Settings>
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
                          <MenuItem onClick={()=> setModalAutorizarOpen(true)} disableRipple>
                            <CheckCircle />
                            Autorizar
                          </MenuItem>
                          <MenuItem onClick={()=> setModalDenegarOpen(true)} disableRipple>
                            <Cancel />
                            Rechazar
                          </MenuItem>
                          <Divider sx={{ my: 0.5 }} />
                          <MenuItem onClick={()=> setModalFactura(true)} disableRipple>
                            <FileCopy />
                            Ver Factura
                          </MenuItem>
                        </StyledMenu>
                      </div>:
                      '-'
                    }
                  </TableCell>
                </TableRow>
              )
            })}
            {egresosTurno.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">No hay gastos registrados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPagesEgresos}
            page={pageEgresos}
            onChange={(e, newPage) => setPageEgresos(newPage)}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
      </Box>

      {/* Abonos del turno */}
      <Typography variant="h6" mb={1}>Abonos del turno</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Fecha y Hora</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Metodo de pago</strong></TableCell>
              <TableCell sx={{width: '130px'}}><strong>Monto</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {abonosTurno?.map((abono) => {
              const fechaOriginal = abono.createdAt;
              const fechaFormateada = dayjs(fechaOriginal).format("YYYY-MM-DD HH:mm");
              const estado = capitalizar(abono.estado)
              let color
              if(abono.estado === 'aprobado'){
                color = 'success'
              } else if(abono.estado === 'anulado'){
                color = 'error'
              }
              return(
                <TableRow key={abono.id}>
                  <TableCell>{fechaFormateada}</TableCell>
                  <TableCell>{abono.nombre}</TableCell>
                  <TableCell>{abono.metodoPago}</TableCell>
                  <TableCell>$ {abono.monto.toLocaleString('es-ES',  {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</TableCell>
                  <TableCell><Chip label={estado} color={color} /></TableCell>
                  <TableCell align="center">
                    {
                      estado === 'Aprobado' ? 
                      <div>
                        <Button
                          id="demo-customized-button"
                          aria-controls={open2 ? 'demo-customized-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open2 ? 'true' : undefined}
                          variant="contained"
                          disableElevation
                          onClick={(event)=> handleAbono(event, abono)}
                          size='small'
                        >
                          <Settings></Settings>
                        </Button>
                        <StyledMenu
                          id="demo-customized-menu"
                          MenuListProps={{
                            'aria-labelledby': 'demo-customized-button',
                          }}
                          anchorEl={anchorEl2}
                          open={open2}
                          onClose={handleClose2}
                        >
                          <MenuItem onClick={()=> setModalAnularOpen(true)} disableRipple>
                            <Cancel />
                            Anular
                          </MenuItem>
                        </StyledMenu>
                      </div>:
                      '-'
                    }
                  </TableCell>
                </TableRow>
              )
            })}
            {abonosTurno.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">No hay abonos registrados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPagesAbonos}
            page={pageAbonos}
            onChange={(e, newPage) => setPageAbonos(newPage)}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
      </Box>

      {/* Movimientos */}
      <Typography variant="h6" gutterBottom>Movimientos del turno</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Fecha y Hora</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Monto</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimientos.map((mov) => {
              let color, simbol
              if(mov.category === 'ingreso'){
                simbol = mov.monto <= 0 ? '' : '+'
                color = mov.monto <= 0 ? 'secondary' : 'success'
              }else if(mov.category === 'egreso'){
                color = 'error'
              }
              const fechaOriginal = mov.updatedAt;
              const fechaFormateada = dayjs(fechaOriginal).format("YYYY-MM-DD HH:mm");
              return(
                <TableRow key={mov.id}>
                  <TableCell>{fechaFormateada}</TableCell>
                  <TableCell>{mov.tipo}</TableCell>
                  <TableCell>{mov.descripcion}</TableCell>
                  <TableCell>
                  <Typography variant='body2' color={color}>{simbol} $ {mov.monto.toLocaleString('es-ES',  {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</Typography>
                  <Typography variant='caption' color='textDisabled'>{Number(mov.saldo).toLocaleString('es-ES',  {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</Typography>
                  </TableCell>
                </TableRow>
              )
            })}
            {movimientos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">No hay movimientos registrados</TableCell>
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
            variant="outlined"
            shape="rounded"
          />
      </Box>

      {/* Modal Ingreso */}
      <Dialog open={modalIngresoOpen} onClose={() => setModalIngresoOpen(false)}>
        <DialogTitle>Agregar Ingreso</DialogTitle>
        <DialogContent>
        <TextField
        select
        fullWidth
        label="Categoria"
        value={ingresosCategory.nombre}
        sx={{ mt: 2 }}
        >
        {ingresosCategory.map((ingreso) => (
          <MenuItem key={ingreso.id} value={ingreso.nombre} onClick={()=> setSelectedIngresoCategory(ingreso)}>
            {ingreso.nombre}
          </MenuItem>
        ))}
        </TextField>
        <TextField
          fullWidth
          label="Monto"
          type="number"
          value={montoIngreso}
          onChange={(e) => setMontoIngreso(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Descripción"
          value={descripcionIngreso}
          onChange={(e) => setDescripcionIngreso(e.target.value)}
          sx={{ mt: 2 }}
        />
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalIngresoOpen(false)}>Cancelar</Button>
        <Button variant="contained" onClick={() => {
          addIngreso()
        }}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Egreso */}
      <Dialog open={modalEgresoOpen} onClose={() => setModalEgresoOpen(false)}>
        <DialogTitle>Agregar Egreso</DialogTitle>
        <DialogContent>
        <TextField
          select
          fullWidth
          label="Categoria"
          value={selectedEgresoCategory.nombre}
          sx={{ mt: 2 }}
        >
        {egresosCategory?.map((egreso) => (
          <MenuItem key={egreso.id} value={egreso.nombre} onClick={()=> setSelectedEgresoCategory(egreso)}>
            {egreso.nombre}
          </MenuItem>
        ))}
        </TextField>
        <TextField
          fullWidth
          label="Monto"
          type="number"
          value={montoEgreso}
          onChange={(e) => setMontoEgreso(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Descripción"
          value={descripcionEgreso}
          onChange={(e) => setDescripcionEgreso(e.target.value)}
          sx={{ mt: 2 }}
        />
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalEgresoOpen(false)}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={() => {
          addEgreso()
        }}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Autorizar Egreso */}
      <Dialog open={modalAutorizarOpen} onClose={() => setModalAutorizarOpen(false)}>
        <DialogTitle>Autorización de gasto</DialogTitle>
        <DialogContent>
        <Typography>¿Esta seguro que desea autorizar este gasto?</Typography>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalAutorizarOpen(false)}>Cancelar</Button>
        <Button variant="contained" color="success" onClick={() => {
          Autorizar();
        }}>Autorizar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Denegar Egreso */}
      <Dialog open={modalDenegarOpen} onClose={() => setModalDenegarOpen(false)}>
        <DialogTitle>Denegar gasto</DialogTitle>
        <DialogContent>
        <Typography>¿Esta seguro que desea denegar este gasto?</Typography>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalDenegarOpen(false)}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={() => {
          Denegar();
        }}>Denegar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Anular Pago */}
      <Dialog open={modalAnularOpen} onClose={() => setModalAnularOpen(false)}>
        <DialogTitle>Anular pago</DialogTitle>
        <DialogContent>
        <Typography>¿Esta seguro que desea anular este pago?</Typography>
        <Typography variant='caption'>Esta acción revertirá el saldo del credito y caja</Typography>
        <Box sx={{width:'100%'}}>
          <TextField
            sx={{width:'100%'}}
            placeholder='Motivo de anulación'
            value={motivoAnulacion}
            onChange={(e)=> setMotivoAnulacion(e.target.value)}
          />
        </Box>

        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalAnularOpen(false)}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={() => {
          anularPago();
        }}>Anular</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Cerrar Caja */}
      <Dialog open={modalCierreOpen} onClose={() => setModalCierreOpen(false)}>
        <DialogTitle>Cerrar Caja</DialogTitle>
        <DialogContent>
        <Typography>¿Esta seguro que desea cerrar esta caja?</Typography>
        <Typography variant='caption' color='error'>Esta acción no se puede revertir</Typography>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalCierreOpen(false)}>Cancelar</Button>
        <Button variant="contained" color="warning" onClick={() => {
          cerrarCaja();
        }}>Cerrar caja</Button>
        </DialogActions>
      </Dialog>

      {/* Modal ver factura */}
      <Dialog open={modalFactura} onClose={() => setModalFactura(false)}>
        <DialogTitle>Factura</DialogTitle>
        <DialogContent>
          <div style={{width: '400px', height: '300px', border: '1px solid #ccc'}}>
            <img src={gastoSelected.foto} alt="factura"  style={{width: '100%', height: '100%', objectFit:'cover'}} />
          </div>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setModalFactura(false)}>Cerrar</Button>
        <Button variant="contained" color='primary' onClick={() => {
          const enlace = document.createElement("a");
          enlace.href = gastoSelected.foto;
          enlace.download = `Factura_${String(gastoSelected.id) + String(gastoSelected.turno_id)}.png`;
          document.body.appendChild(enlace);
          enlace.click();
          document.body.removeChild(enlace);
        }
        }>Descargar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
