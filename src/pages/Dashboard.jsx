import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import {TableContainer, TableHead, TableRow, TableBody, TableCell, Pagination, Paper, Table, TextField, Divider} from '@mui/material';
import { Select, MenuItem, InputLabel, Button } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

// const actions = [
//   { icon: <FileCopyIcon />, name: 'Copy' },
//   { icon: <SaveIcon />, name: 'Save' },
//   { icon: <PrintIcon />, name: 'Print' },
//   { icon: <ShareIcon />, name: 'Share' },
// ];

import { useLocalStorageValue } from '../hooks/useLocalStorageValue';
export default function Dashboard() {
  const [radius] = useState(60);
  const [skipAnimation] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [dataDash, setDataDash] = useState({});
  const [dataDashBars, setDataDashBars] = useState([]);
  const [morosos, setMorosos] = useState(0);
  const [frecuencia, setFrecuencia] = useState('diario');
  const [creditosData, setCreditosData] = useState([]);
  const [interesData, setInteresData] = useState([]);
  const [recaudoData, setRecaudoData] = useState([]);
  const [ingresosData, setIngresosData] = useState([]);
  const [egresosData, setEgresosData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [rutas, setRutas] = useState([])
  const API_BASE = `${import.meta.env.VITE_API_URL}`;
  const token = localStorage.getItem('token');
  const rutaId = useLocalStorageValue('rutaId');

  const getDataDash = async()=>{
    try {
      const res = await axios.get(`${API_BASE}creditos/datadash?id=${rutaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDataDash(res.data)
      console.log(res.data)
      const altoRiesgo = Number(res.data.creditos_alto_riesgo)
      const vencidos = Number(res.data.creditos_vencidos)
      const morosos = altoRiesgo + vencidos
      setMorosos(morosos)
    } catch (err) {
      console.log(err)
      setDataDash({
        "total_impagos": "0",
        "cartera": "0",
        "creditos_alto_riesgo": "0",
        "creditos_vencidos": "0",
        "creditos_atrasados": "0",
        "creditos_al_dia": "0",
        "cartera_alto_riesgo": null,
        "cartera_vencidos": "0",
        "cartera_atrasados": null,
        "cartera_al_dia": null,
        "saldo_caja": "0",
        "turno_id": null,
        "recaudacion": "0",
        "gastos": "0"
    })
    }
  }

  const getDataDashBars = async()=>{
    try {
      const res = await axios.get(`${API_BASE}creditos/datadashbars?id=${rutaId}&q=${frecuencia}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data)
      setDataDashBars(res.data)
    } catch (err) {
      console.log(err)
      setDataDashBars([{
        "fecha": "2025-09-02T05:00:00.000Z",
        "total_creditos": "0",
        "total_interes": "0",
        "recaudo": "0",
        "ingresos": "0",
        "egresos": "0"
    }])
    }
  }

  const getTurnoRutas = async()=>{
    try {
      const res = await axios.get(`${API_BASE}caja/turnos-abiertos?page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data)
      setRutas(res.data.data.turnos)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.log(err)
      setRutas([])
    }
  }

  // Dashboard Cards
  const cards = [
    {
      id: 1,
      title: 'Créditos Activos',
      description: <Chip color="default" label={`${dataDash.total_impagos}`} sx={{fontSize:'24px'}} variant="outlined" />,
      icon: <CreditScoreIcon color='default' sx={{fontSize:'48px'}} />,
    },
    {
      id: 2,
      title: 'Morosos',
      description: <Chip color="warning" label={morosos} c variant="outlined" sx={{fontSize:'24px'}} />,
      icon: <PersonOffIcon color='warning' sx={{fontSize:'48px'}}/>,
    },
    {
      id: 3,
      title: 'Cartera',
      description: <Chip color="secondary" label={`$ ${dataDash.cartera}`} variant="outlined" sx={{fontSize:'24px'}} />,
      icon: <AttachMoneyIcon color='secondary' sx={{fontSize:'48px'}} />,
    },
    {
      id: 4,
      title: 'Caja',
      description: <Chip color="info" label={`$ ${dataDash.saldo_caja}`} variant="outlined" sx={{fontSize:'24px'}} />,
      icon: <AttachMoneyIcon color='info' sx={{fontSize:'48px'}} />
    },
    {
      id: 5,
      title: 'Gastos',
      description: <Chip color="error" label={dataDash.gastos} variant="outlined" sx={{fontSize:'24px'}}/>,
      icon: <PersonOffIcon color='error' sx={{fontSize:'48px'}} />,
    },
    {
      id: 6,
      title: 'Recaudación',
      description: <Chip color="success" label={dataDash.recaudacion} variant="outlined" sx={{fontSize:'24px'}} />,
      icon: <AttachMoneyIcon color='success' sx={{fontSize:'48px'}} />
    }
  ];

  const data = [
    {
      "label": "Atrasados",
      "value": dataDash.creditos_atrasados,
      "cartera": dataDash.cartera_atrasados || 0,
      "porcentaje": (Number(dataDash.creditos_atrasados) / Number(dataDash.total_impagos) * 100).toFixed(2)
    },
    {
        "label": "Alto riesgo",
        "value": dataDash.creditos_alto_riesgo,
        "cartera": dataDash.cartera_alto_riesgo || 0,
        "porcentaje": (Number(dataDash.creditos_alto_riesgo) / Number(dataDash.total_impagos) * 100).toFixed(2)
    },
    {
        "label": "Vencidos",
        "value": dataDash.creditos_vencidos,
        "cartera": dataDash.cartera_vencidos || 0,
        "porcentaje": (Number(dataDash.creditos_vencidos) / Number(dataDash.total_impagos) * 100).toFixed(2)
    },
    {
        "label": "Al día",
        "value": dataDash.creditos_al_dia,
        "cartera": dataDash.cartera_al_dia || 0,
        "porcentaje": (Number(dataDash.creditos_al_dia) / Number(dataDash.total_impagos) * 100).toFixed(2)
    }
  ]

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);

    // Configurar el formato deseado
    const opcionesFecha = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    const opcionesHora = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const fechaFormateada = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(fecha);
    const horaFormateada = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);

    return `${capitalize(fechaFormateada)} - ${horaFormateada}`;
  }

  function capitalize(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  useEffect(()=>{
    getTurnoRutas()
  },[search, page])

  useEffect(() => {
    if (!dataDashBars) return;
  
    const creditos = [];
    const interes = [];
    const recaudo = [];
    const ingresos = [];
    const egresos = [];
    const labels = [];
  
    dataDashBars.forEach((element) => {
      const fecha = new Date(element.fecha);
      const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const diaSemana = diasSemana[fecha.getDay()];
  
      creditos.push(element.total_creditos);
      interes.push(element.total_interes);
      recaudo.push(element.recaudo);
      ingresos.push(element.ingresos);
      egresos.push(element.egresos);
      labels.push(diaSemana);
    });
  
    setCreditosData(creditos);
    setInteresData(interes);
    setRecaudoData(recaudo);
    setIngresosData(ingresos);
    setEgresosData(egresos);
    setXLabels(labels);
  }, [dataDashBars]);  

  useEffect(()=>{
    getDataDash()
  },[rutaId])

  useEffect(()=>{
    getDataDashBars()
  },[rutaId, frecuencia])

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <h2>Dashboard</h2>
        <Grid container spacing={2}>
          {/* Cards */}
          <Grid item size={12}>
            <Box sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
              gap: 2,
            }}>
              {cards.map((card, index) => (
                <Card key={index}>
                  <CardActionArea
                    onClick={() => setSelectedCard(index)}
                    data-active={selectedCard === index ? '' : undefined}
                    sx={{
                      height: '100%',
                      '&[data-active]': {
                        backgroundColor: 'action.selected',
                        '&:hover': {
                          backgroundColor: 'action.selectedHover',
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ height: '100%', display:'flex', gap:3 }}>
                      <section>
                        {card.icon}
                      </section>
                      <section>
                      <Typography variant="body1" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {card.description}
                      </Typography>
                      </section>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* Pie Chart */}
          <Grid item size={6}>
            <Card variant="outlined">
              <CardContent>
              <PieChart
                height={268}
                colors={['#00A7E1', '#E28413', '#F45B69', '#19647E', '#F45B69']}
                slotProps={{
                  tooltip: { trigger: 'item' }
                }}
                series={[{
                  data: data.map((item) => ({
                    label: item.label,
                    id: item.label,
                    value: item.value,
                  })),
                  paddingAngle: 1,
                  cornerRadius: 5,
                  innerRadius: radius,
                  arcLabel: (param)=> `${param.value}`,
                  arcLabelMinAngle: 10,
                  valueFormatter: (v, { dataIndex }) => {
                    const item = data[dataIndex];
                    return `• Créditos: ${item.value} • Cartera: $${item.cartera.toLocaleString()} • ${item.porcentaje}%`;
                  }
                }]}
                skipAnimation={skipAnimation}
              >
                <PieCenterLabel>Créditos</PieCenterLabel>
              </PieChart>
              </CardContent>
            </Card>
          </Grid>

          {/* Line Chart */}
          <Grid item size={6}>
            <Card variant="outlined">
              <CardContent>
                <InputLabel>Frecuencia</InputLabel>
                <Select
                  value={frecuencia}
                  onChange={(e)=> setFrecuencia(e.target.value)}
                  size='small'
                  sx={{width:'100%', marginBottom:2}}
                  >
                      <MenuItem key={1} value="diario">Diario</MenuItem>
                      <MenuItem key={2} value="semanal">Semanal</MenuItem>
                </Select>
                {(xLabels.length > 0) ? (
                  <BarChart
                    height={160}
                    colors={['#00A7E1', '#E28413', '#60cf9a', '#19647E', '#F45B69']}
                    series={[
                      { data: creditosData, label: 'Créditos' },
                      { data: interesData, label: 'Interes' },
                      { data: recaudoData, label: 'Recaudo' },
                      { data: ingresosData, label: 'Ingresos' },
                      { data: egresosData, label: 'Egresos' },
                    ]}
                    xAxis={[{ data: xLabels }]}
                    yAxis={[{ width: 10 }]}
                  />
                ) : (
                  <div>Cargando datos del gráfico...</div>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* SpeedDial */}
          {/* <SpeedDial
            className="speeddial"
            ariaLabel="Accesos rápidos"
            sx={{ position: 'fixed', bottom: 16, right: 26 }}
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial> */}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={6}>
            <Typography variant="h6">Estado de cajas</Typography>
          </Grid>
          <Grid size={6}>
            <TextField
              size='small'
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
                    <TableCell><strong>Caja</strong></TableCell>
                    <TableCell><strong>Saldo Inicial</strong></TableCell>
                    <TableCell><strong>Saldo Actual</strong></TableCell>
                    <TableCell><strong>Fecha Apertura</strong></TableCell>
                    <TableCell><strong>Apertura por</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rutas.map((ruta) => {
                    const estado = ruta.estado === 'abierta' ? 'Abierta' : "Bloqueada"
                    const color = ruta.estado === 'abierta' ? 'success' : "error"
                    const fecha = formatearFecha(ruta.fecha_apertura)
                    return(
                      <TableRow key={ruta.ruta_id}>
                        <TableCell width={200}>{ruta.ruta_nombre}</TableCell>
                        <TableCell><Chip size='small' color='primary' label={`$ ${ruta.monto_inicial}`}></Chip></TableCell>
                        <TableCell><Chip size='small' color='secondary' label={`$ ${ruta.saldo}`}></Chip></TableCell>
                        <TableCell>{fecha}</TableCell>
                        <TableCell>{ruta.usuario_nombre}</TableCell>
                        <TableCell><Chip size='small' color={color} label={`${estado}`}></Chip></TableCell>
                      </TableRow>
                    )
                  })}
                  {rutas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay cajas pendientes de cierre.
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
      </Box>
    </Box>
  );
}

Dashboard.requireAuth = true;