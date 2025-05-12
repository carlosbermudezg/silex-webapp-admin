import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import ReporteUtilidadPDF from './ReporteUtilidadPDF';
import {
  Box, Button, TextField, MenuItem, Typography, Select, InputLabel, FormControl
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function ReporteUtilidad() {
  const [tipoFiltro, setTipoFiltro] = useState('ruta');
  const [valorFiltro, setValorFiltro] = useState('');
  const [desde, setDesde] = useState(dayjs());
  const [hasta, setHasta] = useState(dayjs());
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');

  const datosSimulados = [
    { fecha: '2025-04-01', descripcion: 'Ingreso cliente A', monto: 500 },
    { fecha: '2025-04-02', descripcion: 'Egreso papelería', monto: -200 },
  ];

  const generarPDF = async () => {
    if(!desde || !hasta) return toast.error('Debe establecer una fecha de inicio y final')
    if(desde > hasta) return toast.error('La fecha inicial debe ser mayor a la final')
    const doc = (
      <ReporteUtilidadPDF
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
      <Typography variant="h5" gutterBottom marginBottom={3}>
        Reporte de Utilidad
      </Typography>

      <Box display="flex" gap={2} mb={3} alignItems="center" flexWrap="wrap">

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Desde"
            value={desde}
            onChange={(newValue) => setDesde(newValue)}
            slotProps={{
              textField: {
                size: 'small',
                InputLabelProps: { shrink: true },
              },
            }}
          />
          <DatePicker
            label="Hasta"
            value={hasta}
            onChange={(newValue) => setHasta(newValue)}
            slotProps={{
              textField: {
                size: 'small',
                InputLabelProps: { shrink: true },
              },
            }}
          />
        </LocalizationProvider>

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