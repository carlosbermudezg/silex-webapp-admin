'use client';
import * as React from 'react';
import {
  TableContainer, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, TextField, Pagination,
  MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Paper, Grid, Tabs, Tab, FormControlLabel, Checkbox
} from '@mui/material';

import {
  ShoppingBasketRounded,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Today,
  Save,
  EditOutlined,
  Category
} from '@mui/icons-material';

import EgresosCategory from './Egresos/EgresosCategoy';
import IngresosCategory from './Ingresos/IngresosCategory';

import PropTypes from 'prop-types';

import toast from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function General() {
  const [value, setValue] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rutas, setRutas] = React.useState([])
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [diasNoLaborables, setDiasNoLaborables] = React.useState([]);
  const [confirmDialog, setConfirmDialog] = React.useState({ open: false, id: null });
  const [crearDialogOpen, setCrearDialogOpen] = React.useState(false);
  const [nuevaFecha, setNuevaFecha] = React.useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = React.useState('');
  const [diasPage, setDiasPage] = React.useState(1);
  const [diasTotalPages, setDiasTotalPages] = React.useState(1);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedRuta, setSelectedRuta] = React.useState(null);
  const [rutaNombre, setRutaNombre] = React.useState('');
  const [montoMinimo, setMontoMinimo] = React.useState('');
  const [montoMaximo, setMontoMaximo] = React.useState('');
  const [plazoMinimo, setPlazoMinimo] = React.useState('');
  const [plazoMaximo, setPlazoMaximo] = React.useState('');
  const [interes, setInteres] = React.useState('');
  const [maxCreditos, setMaxCreditos] = React.useState('');
  const [frecuenciaPago, setFrecuenciaPago] = React.useState([]);
  const [configCaja, setConfigCaja] = React.useState({});

  //Default Values
  const [montoMinimoDefault, setMontoMinimoDefault] = React.useState('');
  const [montoMaximoDefault, setMontoMaximoDefault] = React.useState('');
  const [plazoMinimoDefault, setPlazoMinimoDefault] = React.useState('');
  const [plazoMaximoDefault, setPlazoMaximoDefault] = React.useState('');
  const [interesDefault, setInteresDefault] = React.useState('');
  const [maxCreditosDefault, setMaxCreditosDefault] = React.useState('');
  const [frecuenciaPagoDefault, setFrecuenciaPagoDefault] = React.useState([]);
  const [daysYellow, setDaysYellow] = React.useState('');
  const [daysRed, setDaysRed] = React.useState('');
  const [abonoMaximo, setAbonoMaximo] = React.useState('');
  const [minimoNovacion, setMinimoNovacion] = React.useState('');


  const [horaApertura, setHoraApertura] = React.useState('00:00:00');
  const [horaCierre, setHoraCierre] = React.useState('00:00:00');
  const [horaGastos, setHoraGastos] = React.useState('00:00:00');

  const handleChangeTime = (event) => {
    const value = event.target.value;
    // Si deseas forzar el formato HH:mm:ss
    const [hh, mm] = value.split(':');
    const formatted = `${hh}:${mm}:00`;
    return formatted;
  };

  const token = localStorage.getItem('token');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEditRuta = (ruta) => {
    setSelectedRuta(ruta);
    setRutaNombre(ruta.ruta_nombre);
    setMontoMinimo(ruta.monto_minimo);
    setMontoMaximo(ruta.monto_maximo);
    setPlazoMinimo(ruta.plazo_minimo);
    setPlazoMaximo(ruta.plazo_maximo);
    setInteres(ruta.interes);
    setMaxCreditos(ruta.max_credits);
    setFrecuenciaPago(parseFrecuenciaPago(ruta.frecuencia_pago));
    setEditDialogOpen(true);
  };  

  const parseFrecuenciaPago = (cadena) => {
    return cadena
      .replace(/[{}]/g, '')  // Quita las llaves
      .split(',')            // Separa por coma
      .map((f) => f.trim()); // Quita espacios
  };

  const handleFrecuenciaChange = (event) => {
    const value = event.target.value;
    setFrecuenciaPago((prevState) =>
      prevState.includes(value)
        ? prevState.filter((item) => item !== value)
        : [...prevState, value]
    );
  };

  const handleFrecuenciaChangeDefault = (event) => {
    const value = event.target.value;
    setFrecuenciaPagoDefault((prevState) =>
      prevState.includes(value)
        ? prevState.filter((item) => item !== value)
        : [...prevState, value]
    );
  };

  const handleSaveChanges = async () => {
    const updatedRuta = {
      ...selectedRuta,
      monto_minimo: montoMinimo,
      monto_maximo: montoMaximo,
      plazo_minimo: plazoMinimo,
      plazo_maximo: plazoMaximo,
      interes: interes,
      max_credits: maxCreditos,
      frecuencia_pago: frecuenciaPago.join(','),
    };
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}config/ruta/${selectedRuta.ruta_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRuta),
      });
  
      if (res.ok) {
        toast.success('Ruta actualizada correctamente');
        fetchRutas(page); // Vuelve a cargar las rutas
        setEditDialogOpen(false);
      } else {
        toast.error('Hubo un error al actualizar la ruta');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      toast.error('Hubo un error al actualizar la ruta');
    }
  };

  const handleSaveDefaultConfig = async ()=>{

    const body = {
        monto_minimo : montoMinimoDefault,
        monto_maximo : montoMaximoDefault,
        plazo_minimo : plazoMaximoDefault,
        plazo_maximo : plazoMaximoDefault,
        interes : interesDefault,
        max_credits : maxCreditosDefault,
        frecuencia_pago : frecuenciaPagoDefault,
        days_to_yellow : daysYellow,
        days_to_red : daysRed,
        porcentaje_abono_maximo : abonoMaximo,
        porcentaje_minimo_novacion : minimoNovacion
    }

    await axios.put(`${import.meta.env.VITE_API_URL}config/default`, body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    ).then(()=>{
      toast.success('Configuración actualizada')
    })
    .catch(()=>{
      toast.error('Hubo un error al actualizar la configuración')
    })
  }

  const fetchRutas = async (page) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}config/rutas?page=${page}&limit=5&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRutas(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error cargando rutas:', err);
    }
  };

  const fetchDefaultValues = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}config/default`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMontoMaximoDefault(data.monto_maximo);
      setMontoMinimoDefault(data.monto_minimo);
      setPlazoMaximoDefault(data.plazo_maximo);
      setPlazoMinimoDefault(data.plazo_minimo)
      setMaxCreditosDefault(data.max_credits);
      setInteresDefault(data.interes)
      setFrecuenciaPagoDefault(data.frecuencia_pago);
      setDaysYellow(data.days_to_yellow);
      setDaysRed(data.days_to_red);
      setAbonoMaximo(data.porcentaje_abono_maximo);
      setMinimoNovacion(data.porcentaje_minimo_novacion);
    } catch (err) {
      console.error('Error cargando configuración por defecto:', err);
    }
  };

  const handleCrearDia = async () => {
    if (!nuevaFecha || !nuevaDescripcion) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}config/nolaborable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fecha: nuevaFecha, descripcion: nuevaDescripcion }),
      });

      if (res.ok) {
        toast.success('Día no laborable agregado');
        fetchDiasNoLaborables(); // Recargar lista
        setCrearDialogOpen(false);
        setNuevaFecha('');
        setNuevaDescripcion('');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al agregar día');
      }
    } catch (err) {
      console.error('Error al crear día:', err);
      toast.error('No se pudo agregar el día');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}config/nolaborable/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success('Día no laborable eliminado');
        fetchDiasNoLaborables(); // Actualizar tabla
      } else {
        const err = await res.json();
        toast.error(err.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error al eliminar día:', error);
      toast.error('Error al eliminar día no laborable');
    } finally {
      setConfirmDialog({ open: false, id: null });
    }
  };

  const fetchDiasNoLaborables = async (page = 1, limit = 5) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}config/nolaborable?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDiasNoLaborables(data.data || []);
      setDiasTotalPages(data.totalPages || 1);
      setDiasPage(data.currentPage || 1);
    } catch (error) {
      console.error('Error al cargar días no laborables:', error);
      toast.error('No se pudieron cargar los días no laborables');
    }
  };

  const fetchConfigCaja = async ()=>{
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}config/caja`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data)
      setHoraApertura(data[0].hora_apertura_caja)
      setHoraCierre(data[0].hora_cierre_caja)
      setHoraGastos(data[0].hora_gastos)
      setConfigCaja(data[0])
    } catch (error) {
      console.log(error)
      toast.error('No se pudio cargar la configuracion de cajas');
    }
  }

  const handleSaveConfigCaja = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}config/caja`, {
        method: 'PUT', // o 'POST' si estás creando por primera vez
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hora_cierre_caja: horaCierre,
          hora_apertura_caja: horaApertura,
          hora_gastos: horaGastos
        }),
      });
  
      if (!response.ok) throw new Error('Error al guardar la configuración');
  
      toast.success('Configuración actualizada');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo actualizar la configuración.');
    }
  };  

  React.useEffect(() => {
    if (value === 2) {
      fetchDiasNoLaborables(diasPage);
    }
    if (value === 1) {
      fetchConfigCaja();
    }
    if (value === 0) {
      fetchDefaultValues();
      fetchRutas(page);
    }
  }, [value, diasPage, page, search]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Typography variant='h5'>Ajustes Generales</Typography>
          </Grid>
          <Grid item size={12}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Créditos" {...a11yProps(0)} />
                  <Tab label="Caja" {...a11yProps(1)} />
                  <Tab label="No laborable" {...a11yProps(2)} />
                  <Tab label="Ingresos" {...a11yProps(3)} />
                  <Tab label="Egresos" {...a11yProps(4)} />
                  {/* <Tab label="Buró" {...a11yProps(5)} /> */}
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Grid container sx={{ gap: 4 }}>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Typography variant="h6">Configuración de créditos por defecto</Typography>
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Monto máximo de crédito</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Monto máximo"
                        type="text"
                        size='small'
                        value={montoMaximoDefault}
                        onChange={(e)=> setMontoMaximoDefault(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Monto mínimo de crédito</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Monto minimo"
                        type="text"
                        size='small'
                        value={montoMinimoDefault}
                        onChange={(e)=> setMontoMinimoDefault(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Plazo máximo de crédito</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Plazo máximo"
                        type="text"
                        size='small'
                        value={plazoMaximoDefault}
                        onChange={(e)=> setPlazoMaximoDefault(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Plazo mínimo de crédito</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Plazo minimo"
                        type="text"
                        size='small'
                        value={plazoMinimoDefault}
                        onChange={(e)=> setPlazoMinimoDefault(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Interés</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Interés"
                        type="text"
                        size='small'
                        value={interesDefault}
                        onChange={(e)=> setInteresDefault(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Límite de créditos</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Límite"
                        type="text"
                        size='small'
                        value={maxCreditosDefault}
                        onChange={(e)=> setMaxCreditosDefault(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Días para amarillo</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Amarillo"
                        type="text"
                        size='small'
                        value={daysYellow}
                        onChange={(e)=> setDaysYellow(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Días para rojo</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Rojo"
                        type="text"
                        size='small'
                        value={daysRed}
                        onChange={(e)=> setDaysRed(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Porcentaje máximo de abono de la deuda inicial</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Abono máximo %"
                        type="text"
                        size='small'
                        value={abonoMaximo}
                        onChange={(e)=> setAbonoMaximo(e.target.value)}
                      />
                    </Grid>
                    <Grid size={3}>
                      <Typography variant="body1">Porcentaje minimo de deuda para Renovación</Typography>
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Mínimo novación %"
                        type="text"
                        size='small'
                        value={minimoNovacion}
                        onChange={(e)=> setMinimoNovacion(e.target.value)}
                      />
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="body1">Frecuencia de pago permitidas</Typography>
                    </Grid>
                    <Grid size={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="diario"
                            checked={frecuenciaPagoDefault.includes('diario')}
                            onChange={handleFrecuenciaChangeDefault}
                          />
                        }
                        label="Diario"
                      />
                    </Grid>
                    <Grid size={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="semanal"
                            checked={frecuenciaPagoDefault.includes('semanal')}
                            onChange={handleFrecuenciaChangeDefault}
                          />
                        }
                        label="Semanal"
                      />
                    </Grid>
                    <Grid size={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="quincenal"
                            checked={frecuenciaPagoDefault.includes('quincenal')}
                            onChange={handleFrecuenciaChangeDefault}
                          />
                        }
                        label="Quincenal"
                      />
                    </Grid>
                    <Grid size={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="mensual"
                            checked={frecuenciaPagoDefault.includes('mensual')}
                            onChange={handleFrecuenciaChangeDefault}
                          />
                        }
                        label="Mensual"
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveDefaultConfig}
                      >
                        Guardar
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                      <Grid size={6}>
                        <Typography variant="h6">Configuración de créditos por ruta</Typography>
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          label="Buscar por ruta"
                          type='text'
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </Grid>
                      <Grid size={12}>  
                        <TableContainer component={Paper}>
                          <Table size='small'>
                            <TableHead>
                              <TableRow>
                                <TableCell><strong>Ruta</strong></TableCell>
                                <TableCell><strong>Monto Mínimo</strong></TableCell>
                                <TableCell><strong>Monto Máximo</strong></TableCell>
                                <TableCell><strong>Plazo Mínimo (días)</strong></TableCell>
                                <TableCell><strong>Plazo Máximo (días)</strong></TableCell>
                                <TableCell><strong>Interés (%)</strong></TableCell>
                                <TableCell><strong>Máx. Créditos</strong></TableCell>
                                <TableCell><strong>Acciones</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rutas.map((ruta) => (
                                <TableRow key={ruta.ruta_id}>
                                  <TableCell width={200}>{ruta.ruta_nombre}</TableCell>
                                  <TableCell>{ruta.monto_minimo}</TableCell>
                                  <TableCell>{ruta.monto_maximo}</TableCell>
                                  <TableCell>{ruta.plazo_minimo}</TableCell>
                                  <TableCell>{ruta.plazo_maximo}</TableCell>
                                  <TableCell>{ruta.interes}</TableCell>
                                  <TableCell>{ruta.max_credits}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="contained"
                                      onClick={() => handleEditRuta(ruta)}
                                    >
                                      <EditIcon></EditIcon>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {rutas.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={8} align="center">
                                    No hay rutas de crédito registradas
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
                      </Grid>
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Typography variant='body1'>Hora de apertura de caja:</Typography>
                  </Grid>
                  <Grid size={8}>
                    <TextField
                      label="Hora de apertura"
                      type="time"
                      size='small'
                      value={horaApertura.slice(0, 5)} // solo HH:mm para el input
                      onChange={(e)=> setHoraApertura(handleChangeTime(e))}
                    />
                  </Grid>
                  <Grid size={4}>
                    <Typography variant='body1'>Hora de cierre de caja:</Typography>
                  </Grid>
                  <Grid size={8}>
                    <TextField
                      label="Hora de cierre"
                      type="time"
                      size='small'
                      value={horaCierre.slice(0, 5)} // solo HH:mm para el input
                      onChange={(e)=> setHoraCierre(handleChangeTime(e))}
                    />
                  </Grid>
                  <Grid size={4}>
                    <Typography variant='body1'>Hora máxima para ingreso de gastos:</Typography>
                  </Grid>
                  <Grid size={8}>
                    <TextField
                      label="Hora de gastos"
                      type="time"
                      size='small'
                      value={horaGastos.slice(0, 5)} // solo HH:mm para el input
                      onChange={(e)=> setHoraGastos(handleChangeTime(e))}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveConfigCaja}
                    >
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Grid container spacing={2}>
                  <Grid item size={10}>
                    <Typography variant='h5'>Días no laborables</Typography>
                  </Grid>
                  <Grid item size={2}>
                    <Button
                      variant="contained"
                      startIcon={<Today />}
                      onClick={() => setCrearDialogOpen(true)}
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
                        <TableCell><strong>Fecha</strong></TableCell>
                        <TableCell><strong>Descripción</strong></TableCell>
                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {diasNoLaborables.map((dia) => (
                        <TableRow key={dia.id}>
                          <TableCell>
                            {new Date(dia.fecha).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>{dia.descripcion}</TableCell>
                          <TableCell align="center">
                            <Button
                              color="error"
                              onClick={() => setConfirmDialog({ open: true, id: dia.id })}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {diasNoLaborables.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No hay días no laborables registrados
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={diasTotalPages}
                    page={diasPage}
                    onChange={(e, newPage) => setDiasPage(newPage)}
                    color="primary"
                  />
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <IngresosCategory></IngresosCategory>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={4}>
                <EgresosCategory></EgresosCategory>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={5}>
                Buró
              </CustomTabPanel>
            </Box>
          </Grid>
        </Grid>
        {/* Modal para agregar dia no laborable */}
        <Dialog open={crearDialogOpen} onClose={() => setCrearDialogOpen(false)}>
          <DialogTitle>Agregar Día No Laborable</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Descripción"
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCrearDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCrearDia} variant="contained">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        {/* Modal para editar la config de la ruta */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Editar configuración de <strong>{rutaNombre}</strong></DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Monto Mínimo"
              type="number"
              value={montoMinimo}
              onChange={(e) => setMontoMinimo(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Monto Máximo"
              type="number"
              value={montoMaximo}
              onChange={(e) => setMontoMaximo(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Plazo Mínimo (días)"
              type="number"
              value={plazoMinimo}
              onChange={(e) => setPlazoMinimo(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Plazo Máximo (días)"
              type="number"
              value={plazoMaximo}
              onChange={(e) => setPlazoMaximo(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Interés (%)"
              type="number"
              value={interes}
              onChange={(e) => setInteres(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Máx. Créditos"
              type="number"
              value={maxCreditos}
              onChange={(e) => setMaxCreditos(e.target.value)}
              sx={{ mt: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="mensual"
                  checked={frecuenciaPago.includes('mensual')}
                  onChange={handleFrecuenciaChange}
                />
              }
              label="Mensual"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="quincenal"
                  checked={frecuenciaPago.includes('quincenal')}
                  onChange={handleFrecuenciaChange}
                />
              }
              label="Quincenal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="semanal"
                  checked={frecuenciaPago.includes('semanal')}
                  onChange={handleFrecuenciaChange}
                />
              }
              label="Semanal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="diario"
                  checked={frecuenciaPago.includes('diario')}
                  onChange={handleFrecuenciaChange}
                />
              }
              label="Diario"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveChanges} variant="contained">Guardar Cambios</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, id: null })}
        >
          <DialogTitle>¿Eliminar día no laborable?</DialogTitle>
          <DialogContent>
            <Typography>Esta acción no se puede deshacer.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ open: false, id: null })}>
              Cancelar
            </Button>
            <Button
              color="error"
              onClick={() => handleDelete(confirmDialog.id)}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

General.requireAuth = true;