import React, { useState } from 'react';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import EstadoCuentaPDF from './EstadoCuentaPDF';
import {
  Box, Button, Typography, Grid
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useLocalStorageValue } from '../../../hooks/useLocalStorageValue';

export default function ReporteEstadoCuenta() {
  const [desde, setDesde] = useState(dayjs());
  const [hasta, setHasta] = useState(dayjs());
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
  const rutaId = useLocalStorageValue('rutaId');

  const generarPDF = async () => {
    if (!desde || !hasta) {
      return toast.error('Debe establecer una fecha de inicio y final');
    }
    if (desde > hasta) {
      return toast.error('La fecha inicial debe ser mayor a la final');
    }

    // Si hay un blob previo, liberarlo
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl('');
    }

    const doc = (
      <EstadoCuentaPDF
        desde={desde}
        hasta={hasta}
        ruta={rutaId}
      />
    );
    const blob = await pdf(doc).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    setPdfBlobUrl(blobUrl);
  };

  return (
    <Box p={4}>
      <Grid container spacing={2}>
        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1" gutterBottom marginBottom={3}>
            Reporte de Estado de Cuenta
          </Typography>
        </Grid>
        <Grid item xs={9} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        </Grid>
      </Grid>
      {pdfBlobUrl && (
        <PDFViewer width="100%" height="600">
          <EstadoCuentaPDF
            desde={desde}
            hasta={hasta}
            ruta={rutaId}
            // key={`${desde}-${hasta}-${rutaId}`}
          />
        </PDFViewer>
      )}
    </Box>
  );
}