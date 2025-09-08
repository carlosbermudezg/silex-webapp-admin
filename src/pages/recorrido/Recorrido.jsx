import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { useTheme } from '@mui/material/styles';
import { useLocalStorageValue } from '../../hooks/useLocalStorageValue';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';

// Función para crear Date en mediodía para evitar desfases de zona horaria
function parseDateStringToNoonDate(dateString) {
  // dateString esperado: 'YYYY-MM-DD'
  const [year, month, day] = dateString.split('-').map(Number);
  // new Date(year, monthIndex, day, hours, minutes, seconds, ms)
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

// Función para obtener YYYY-MM-DD desde un objeto Date
function formatDateToYMD(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Componente auxiliar para centrar el mapa según puntos
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    const latLngs = points.map(p => [p.lat, p.lng]);
    const bounds = L.latLngBounds(latLngs);

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [points, map]);

  return null;
}

export default function Recorrido() {
  // Estado fecha en formato string 'YYYY-MM-DD'
  const [fecha, setFecha] = useState(() => {
    // Inicializar con fecha actual en formato YYYY-MM-DD
    const now = new Date();
    return formatDateToYMD(now);
  });

  const [puntos, setPuntos] = useState([]);
  const [usarCobro, setUsarCobro] = useState(false);
  const markerRefs = useRef({});
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const API_BASE = `${import.meta.env.VITE_API_URL}`;
  const token = localStorage.getItem('token');
  const rutaId = useLocalStorageValue('rutaId');

  const createNumeradoIcon = (numero, tipo) => {
    const color = tipo === 'abono' ? '#2ecc71' : '#3498db';
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid white;
        text-align: center;
        color: white;
        font-weight: bold;
        line-height: 28px;
        font-size: 14px;
      ">${numero}</div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28]
    });
  };

  const getRecorrido = async () => {
    try {
      const res = await axios.get(`${API_BASE}recorrido?rutaId=${rutaId}&fecha=${fecha}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordenados = res.data
        .filter(p => (usarCobro ? p.coordenadasCobro : p.cordenadas))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((p, index) => {
          const coordsStr = usarCobro ? p.coordenadasCobro : p.cordenadas;
          const [latStr, lngStr] = coordsStr.split(',').map(s => s.trim());
          return {
            id: p.id,
            lat: parseFloat(latStr),
            lng: parseFloat(lngStr),
            tipo: p.tipo,
            monto: parseFloat(p.monto),
            nombre: p.cliente_nombre,
            fecha: p.createdAt,
            index: index + 1
          };
        });

      setPuntos(ordenados);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRecorrido();
  }, [rutaId, fecha, usarCobro]);

  const handleClickLista = (id) => {
    const marker = markerRefs.current[id];
    if (marker) marker.openPopup();
  };

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <h2>Recorrido de {usarCobro? 'cobro' : 'pago'}</h2>
          </Grid>
          <Grid item size={3}>
            <DatePicker
              label="Fecha"
              sx={{ top: '30%' }}
              // Aquí pasamos un Date con hora al mediodía para evitar desfases
              value={parseDateStringToNoonDate(fecha)}
              onChange={(newValue) => {
                if (newValue) {
                  // Guardamos la fecha como YYYY-MM-DD para evitar problemas de zona horaria
                  const fechaLocal = formatDateToYMD(newValue);
                  setFecha(fechaLocal);
                }
              }}
              format="dd/MM/yyyy"
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Grid>
          <Grid item size={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LocationPinIcon />}
              sx={{ top: '30%' }}
              fullWidth
              onClick={() => setUsarCobro(!usarCobro)}
            >
              {usarCobro ? 'Lugar de Cobro' : 'Lugar de Pago'}
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Box sx={{ height: '75vh', width: '100%', position: 'relative' }}>
        <MapContainer
          center={puntos[0] ? [puntos[0].lat, puntos[0].lng] : [-1.83, -78.18]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {puntos.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={createNumeradoIcon(p.index, p.tipo)}
              ref={(ref) => { if (ref) markerRefs.current[p.id] = ref; }}
            >
              <Popup>
                <strong>{p.index}. {p.nombre}</strong><br />
                Tipo: {p.tipo}<br />
                Monto: ${p.monto.toFixed(2)}<br />
                Fecha: {new Date(p.fecha).toLocaleString()}
              </Popup>
            </Marker>
          ))}

          {puntos.length > 1 && (
            <Polyline
              positions={puntos.map(p => [p.lat, p.lng])}
              pathOptions={{ color: 'purple', weight: 3 }}
            />
          )}

          <FitBounds points={puntos} />
        </MapContainer>

        <Box
          onWheel={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 10,
            transform: 'translateY(-50%)',
            backgroundColor: isDark ? '#1e1e1e' : 'white',
            color: isDark ? 'white' : 'black',
            padding: 2,
            maxHeight: '70vh',
            overflowY: 'auto',
            zIndex: 1000,
            borderRadius: 2,
            boxShadow: 3,
            width: 280,
            fontSize: '0.85rem',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDark ? '#555' : '#bbb',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0',
            },
          }}
        >
          <h4 style={{ marginTop: 0 }}>Recorrido</h4>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {puntos.map((p) => (
              <li
                key={p.id}
                onClick={() => handleClickLista(p.id)}
                style={{
                  marginBottom: 8,
                  padding: 6,
                  backgroundColor: isDark
                    ? p.tipo === 'abono' ? '#264d3b' : '#23394d'
                    : p.tipo === 'abono' ? '#eafaf1' : '#e8f4fc',
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                <strong>{p.index}. {p.nombre}</strong><br />
                ${p.monto.toFixed(2)} - {p.tipo}
              </li>
            ))}
          </ul>
        </Box>
      </Box>
    </Box>
  );
}

Recorrido.requireAuth = true;