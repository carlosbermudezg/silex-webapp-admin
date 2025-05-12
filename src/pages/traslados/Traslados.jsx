'use client';
import * as React from 'react';
import {
  Typography,
  Box, Grid, Tabs, Tab
} from '@mui/material';

import PropTypes from 'prop-types';

import TrasladoClientes from './clientes/TrasladoClientes';
import TrasladarRutas from './rutas/TrasladoRutas';
import TrasladarEfectivo from './efectivo/TrasladoEfectivo';

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

export default function Traslados() {
  const [value, setValue] = React.useState(0);

  const token = localStorage.getItem('token');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }; 

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Typography variant='h5'>Traslados</Typography>
          </Grid>
          <Grid item size={12}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Clientes" {...a11yProps(0)} />
                  <Tab label="Rutas" {...a11yProps(1)} />
                  <Tab label="Efectivo" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <TrasladoClientes></TrasladoClientes>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <TrasladarRutas></TrasladarRutas>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <TrasladarEfectivo></TrasladarEfectivo>
              </CustomTabPanel>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

Traslados.requireAuth = true;