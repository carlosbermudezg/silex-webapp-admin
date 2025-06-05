import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { mobileAndDesktopOS, valueFormatter } from '../utils/webUsageStats';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

import { styled } from '@mui/material/styles';

// Line Chart Data
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490, 3000, 2000, 2780, 1890, 2390];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300, 3000, 9800, 3908, 4800, 3800];
const xLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

import { useLocalStorageValue } from '../hooks/useLocalStorageValue';
export default function Dashboard() {
  const [radius] = useState(50);
  const [itemNb] = useState(4);
  const [skipAnimation] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [dataDash, setDataDash] = useState({})
  const [caja, setCaja] = useState({})

  const API_BASE = `${import.meta.env.VITE_API_URL}`;
  const token = localStorage.getItem('token');
  const rutaId = useLocalStorageValue('rutaId');
  console.log(rutaId)

  const getDataDash = async()=>{
    try {
      const res = await axios.get(`${API_BASE}creditos/datadash?id=${rutaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res)
      setDataDash(res.data)
    } catch (err) {
      console.log(err)
      setDataDash({})
    }
  }

  // Obtener el estado de la caja
  const obtenerCaja = async () => {
    try {
      const response = await axios.get(`${API_BASE}caja/ruta/${rutaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCaja(response.data)
    } catch (err) {
      // toast.error(err.response.data)
    }
  };

  // Dashboard Cards
  const cards = [
    {
      id: 1,
      title: 'Créditos Activos',
      description: <Chip color="info" icon={<CreditScoreIcon />} label={`${dataDash.total_impagos}`} variant="outlined" />,
    },
    {
      id: 2,
      title: 'Morosos',
      description: <Chip color="warning" icon={<PersonOffIcon />} label="0" variant="outlined" />,
    },
    {
      id: 3,
      title: 'Cartera',
      description: <Chip color="success" icon={<AttachMoneyIcon />} label={`${dataDash.cartera}`} variant="outlined" />,
    }
  ];

  const cards1 = [
    {
      id: 1,
      title: 'Caja',
      description: <Chip color="success" icon={<AttachMoneyIcon />} label={`${caja.saldoActual}`} variant="outlined" />,
    },
    {
      id: 2,
      title: 'Gastos',
      description: <Chip color="error" icon={<PersonOffIcon />} label="0" variant="outlined" />,
    },
    {
      id: 3,
      title: 'Recaudación',
      description: <Chip color="success" icon={<AttachMoneyIcon />} label="0" variant="outlined" />,
    }
  ];

  useEffect(()=>{
    getDataDash()
    obtenerCaja()
  },[rutaId])

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
                    <CardContent sx={{ height: '100%' }}>
                      <Typography variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Grid>
          <Grid item size={12}>
            <Box sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
              gap: 2,
            }}>
              {cards1.map((card, index) => (
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
                    <CardContent sx={{ height: '100%' }}>
                      <Typography variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
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
                  colors={['#00A7E1', '#E28413', '#F45B69', '#19647E']}
                  height={250}
                  series={[{
                    data: mobileAndDesktopOS.slice(0, itemNb),
                    innerRadius: radius,
                    arcLabel: (params) => params.label ?? '',
                    arcLabelMinAngle: 20,
                    valueFormatter,
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
                <LineChart
                  width={450}
                  height={222}
                  series={[
                    { data: pData, label: 'Ingresos' },
                    { data: uData, label: 'Egresos' },
                  ]}
                  xAxis={[{ scaleType: 'point', data: xLabels }]}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* SpeedDial */}
          <SpeedDial
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
          </SpeedDial>
        </Grid>
      </Box>
    </Box>
  );
}

Dashboard.requireAuth = true;