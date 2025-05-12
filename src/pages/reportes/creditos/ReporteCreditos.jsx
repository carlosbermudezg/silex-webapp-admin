import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import ReporteCreditosPDF from './ReporteCreditosPDF';
import {
  Box, Button, TextField, MenuItem, Typography, Select, InputLabel, FormControl
} from '@mui/material';

export default function ReporteCreditos() {
  const [tipoFiltro, setTipoFiltro] = useState('ruta');
  const [valorFiltro, setValorFiltro] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');

  const datosSimulados = [
    { fecha: '2025-04-01', descripcion: 'Ingreso cliente A', monto: 500 },
    { fecha: '2025-04-02', descripcion: 'Egreso papelería', monto: -200 },
  ];

  // Dentro del componente ReporteEstadoCuenta, antes del return:
const rutas = [
    { id: '1', nombre: 'Ruta 1' },
    { id: '2', nombre: 'Ruta 2' },
  ];
  
  const oficinas = [
    { id: 'A', nombre: 'Oficina Centro' },
    { id: 'B', nombre: 'Oficina Norte' },
  ];

  const generarPDF = async () => {
    const doc = (
      <ReporteCreditosPDF
        data={datosSimulados}
        filtro={tipoFiltro}
        valorFiltro={valorFiltro}
        desde={desde}
        hasta={hasta}
      />
    );
    const blob = await pdf(doc).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    setPdfBlobUrl(blobUrl);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Reporte de Créditos
      </Typography>

      <Box display="flex" gap={2} mb={3} alignItems="flex-end" flexWrap="wrap">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filtro-label">Filtrar por</InputLabel>
          <Select
            labelId="filtro-label"
            value={tipoFiltro}
            label="Filtrar por"
            onChange={(e) => {
              setTipoFiltro(e.target.value);
              setValorFiltro(''); // Reinicia el valor al cambiar tipo
            }}
          >
            <MenuItem value="ruta">Ruta</MenuItem>
            <MenuItem value="oficina">Oficina</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="valor-filtro-label">
                {tipoFiltro === 'ruta' ? 'Ruta' : 'Oficina'}
            </InputLabel>
            <Select
                labelId="valor-filtro-label"
                value={valorFiltro}
                label={tipoFiltro === 'ruta' ? 'Ruta' : 'Oficina'}
                onChange={(e) => setValorFiltro(e.target.value)}
            >
                {(tipoFiltro === 'ruta' ? rutas : oficinas).map((item) => (
                <MenuItem key={item.id} value={item.nombre}>
                    {item.nombre}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

        <TextField
          type="date"
          label="Desde"
          InputLabelProps={{ shrink: true }}
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
        />

        <TextField
          type="date"
          label="Hasta"
          InputLabelProps={{ shrink: true }}
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
        />

        <Button variant="contained" onClick={generarPDF}>
          Generar PDF
        </Button>
      </Box>

      {pdfBlobUrl && (
        <iframe
          src={pdfBlobUrl}
          width="100%"
          height="600px"
          title="Reporte PDF"
          style={{ border: '1px solid #ccc' }}
        />
      )}
    </Box>
  );
}