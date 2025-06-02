import { useState, Fragment, useEffect } from 'react';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Dialog, DialogContent, DialogTitle, IconButton, ImageList, ImageListItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Perfil() {

  const [openViewer, setOpenViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cliente, setCliente] = useState({})
  const token = localStorage.getItem('token')

  const handleOpenViewer = (img) => {
    setSelectedImage(img);
    setOpenViewer(true);
  };

  const handleCloseViewer = () => {
    setOpenViewer(false);
    setSelectedImage(null);
  };

  useEffect(()=>{
    const fetchCliente = async()=>{
      await axios.get(`${import.meta.env.VITE_API_URL}clientes/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then( (response)=>{
        console.log(response)
        setCliente(response.data)
      } )
      .catch( error => console.log(error))
    }
    fetchCliente()
  },[])

  const { id } = useParams();
  console.log(id)

  const [openModal, setOpenModal] = useState(false);
  const [openModalArchivo, setOpenModalArchivo] = useState(false);


  const handleCloseModal = () => {
    setOpenModal(false);
  };


  const handleCloseModalArchivo = () => {
    setOpenModalArchivo(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={2}>
        <Grid container size={12}>
          <Grid size={6}>
            <Paper>
            <Typography variant='h5'>Galería</Typography>
              <Box
                sx={{
                  display: 'flex',
                  // flexWrap: 'wrap',
                  '& > :not(style)': {
                    m: 1,
                    width: '50%',
                    height: 150,
                  },
                }}
              >
                <ImageList cols={3} gap={8}>
                  { cliente.fotos == '' && <Typography variant='caption'>No hay fotos</Typography> }
                  {cliente?.fotos?.map((img, index) => (
                    <ImageListItem key={index} onClick={() => handleOpenViewer(img)} style={{ cursor: 'pointer' }}>
                      <img src={img} alt={index} loading="lazy" />
                    </ImageListItem>
                  ))}
                </ImageList>

                <Dialog open={openViewer} onClose={handleCloseViewer} maxWidth="md">
                  <DialogTitle>
                    {selectedImage?.title}
                    <IconButton
                      aria-label="close"
                      onClick={handleCloseViewer}
                      sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent>
                    {selectedImage && (
                      <img src={selectedImage} alt="img" style={{ width: '100%', height: 'auto' }} />
                    )}
                  </DialogContent>
                </Dialog>
              </Box>
              <Grid>
              {
                cliente?.coordenadasCobro && (() => {
                  const [lat, lng] = cliente.coordenadasCobro.split(',').map(Number);
                  const [latCasa, lngCasa] = cliente.coordenadasCasa.split(',').map(Number);
                  if (!lat || !lng) return null;

                  return (
                    <MapContainer
                      center={[lat, lng]}
                      zoom={15}
                      style={{ width: '100%', height: '180px' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[lat, lng]}>
                        <Popup>Coordenada de Cobro</Popup>
                      </Marker>
                      <Marker position={[latCasa, lngCasa]}>
                        <Popup>Coordenada de Casa</Popup>
                      </Marker>
                    </MapContainer>
                  );
                })()
              }

              </Grid>
            </Paper>
          </Grid>
          <Grid size={6}>
            <Paper>
            <Typography variant='h5'>Datos Personales</Typography>
            <Box
                sx={{
                  display: 'flex',
                  // flexWrap: 'wrap',
                  '& > :not(style)': {
                    m: 1,
                    width: '50%',
                    height: 331,
                  },
                }}
              >

              <List sx={{ width: '50%' }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Nombres" secondary={cliente.nombres} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Teléfono" secondary={cliente.telefono} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <BeachAccessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Dirección" secondary={cliente.direccion} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <BeachAccessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Ruta" secondary={cliente.rutaId} />
                </ListItem>
              </List>
              <List sx={{ width: '50%' }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Identificación" secondary={cliente.identificacion} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Nacionalidad" secondary={cliente.nacionalidad} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Coordenada de residencia" secondary={<Link target='_blank' to={`https://www.google.com/maps/search/?api=1&query=${cliente.coordenadasCasa}`}>Ver en Maps</Link>} />
                  
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <BeachAccessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Coordenada de cobro" secondary={<Link target='_blank' to={`https://www.google.com/maps/search/?api=1&query=${cliente.coordenadasCobro}`}>Ver en Maps</Link>} />
                </ListItem>
              </List>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} size={12}>
        <Typography variant='h5'>Créditos activos</Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Código crédito</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Vence</TableCell>
                <TableCell>Cuotas atrasadas</TableCell>
                <TableCell>Interés</TableCell>
                <TableCell>Monto Prestado</TableCell>
                <TableCell>Saldo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cliente?.creditos?.map((row) => {
                const fecha = row.createdAt.split('T')[0]
                const vence = row.fechaVencimiento.split('T')[0]

                const hoy = new Date();

                const cuotasVencidas = row.cuotas.filter(cuota => {
                  const fechaPago = new Date(cuota.fechaPago);
                  return fechaPago < hoy && cuota.estado === "impago";
                });

                return(
                  <TableRow
                    key={row.id}
                  >
                    <TableCell component="th" scope="row">
                      CR{row.id}
                    </TableCell>
                    <TableCell>{fecha}</TableCell>
                    <TableCell>{vence}</TableCell>
                    <TableCell align='center'>{cuotasVencidas.length}</TableCell>
                    <TableCell>{row.interes}%</TableCell>
                    <TableCell>$ {(row.monto)}</TableCell>
                    <TableCell>$ {(Number(row.saldo_capital) + Number(row.saldo_interes)).toFixed(2)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Fragment>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Editar cliente"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                noValidate
                autoComplete="off"
              >
                <div>
                <TextField
                    size='small'
                    required
                    id="outlined-required"
                    label="Nombres completos"
                    value="Carlos Antonio Bermúdez García"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    size='small'
                    required
                    id="outlined-helperText"
                    label="Identificación"
                    value="1313127845"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    size='small'
                    required
                    id="outlined-required"
                    type="number"
                    label="Teléfono"
                    value="0939173643"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    size='small'
                    required
                    id="outlined-required"
                    label="Dirección"
                    value="Av.Maximino Puertas y calle B"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    size='small'
                    required
                    id="outlined-required"
                    label="Coordenadas de residencia"
                    value="-2.139145,-79.886237"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    size='small'
                    required
                    id="outlined-required"
                    label="Coordenadas de Cobro"
                    value="-2.139145,-79.886237"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }} size="small">
                    <InputLabel id="demo-select-small-label">Ruta</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      // value={age}
                      label="Ruta"
                      // onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ruta 1</MenuItem>
                      <MenuItem value={20}>Ruta 2</MenuItem>
                      <MenuItem value={30}>Ruta 3</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size='small'
                    required
                    id="outlined-required"
                    label="Foto de casa"
                    type='file'
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    size='small'
                    required
                    id="outlined-required"
                    label="Foto de identificación"
                    type='file'
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </div>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleCloseModal} autoFocus color='success'>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openModalArchivo}
          onClose={handleCloseModalArchivo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Archivar cliente"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                noValidate
                autoComplete="off"
              >
                <div>
                    <Typography>¿Está seguro que desea archivar este cliente?</Typography>
                </div>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModalArchivo}>Cancelar</Button>
            <Button onClick={handleCloseModalArchivo} autoFocus color='warning'>
              Archivar
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </Box>
  </Box>
  );
}

Perfil.requireAuth = true;