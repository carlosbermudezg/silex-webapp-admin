import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  AccountBalance,
  Search,
  Print,
  PictureAsPdf,
  Badge,
  Home,
  Phone,
  Email,
  LocationCity,
  LocationOnRounded
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const InfoCredito = () => {
  const theme = useTheme();
  const { id } = useParams()
    const token = localStorage.getItem('token')
    const [credito, setCredito] = useState({})

    console.log(credito)

    const fetchCredito = async()=>{
        await axios.get(`${import.meta.env.VITE_API_URL}creditos/${id}`,{
            headers: {
            Authorization: `Bearer ${token}`,
            }
        })
        .then( (response)=>{
            setCredito(response.data)
        } )
        .catch( error => console.log(error))
    }

    useEffect(()=>{
        fetchCredito()
    },[])

    const fechaInicio = credito?.createdAt?.split('T')[0]
    const fechaVencimiento = credito?.fechaVencimiento?.split('T')[0]

    const pagado = (Number(credito?.monto) + Number(credito?.monto_interes_generado) - Number(credito?.saldo)).toFixed(2)
    const monto_a_pagar = (Number(credito?.monto) + Number(credito?.monto_interes_generado)).toFixed(2)
    const porcentajePagado = (pagado * 100 / monto_a_pagar).toFixed(2)

  return (
    <Box
      sx={{
        bgcolor: theme.palette.mode === "dark" ? "#101922" : "#F0F2F5",
        minHeight: "100vh",
      }}
    >
      {/* Main content */}
      <Container sx={{ py: 6 }}>
        {/* Header info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Detalles del Préstamo
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Visión general completa de un préstamo específico
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" startIcon={<Print />}>
              Imprimir
            </Button>
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              sx={{ bgcolor: "#005A9C" }}
            >
              Descargar PDF
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left section */}
          <Grid item xs={12} md={8}>
            {/* Información del Cliente */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Información del Cliente
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      { credito?.cliente?.nombres }
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Badge fontSize="small" />
                      <Typography variant="body2">DNI: {credito?.cliente?.identificacion}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Home fontSize="small" />
                      <Typography variant="body2">
                        { credito?.cliente?.direccion }
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Phone fontSize="small" />
                      <Typography variant="body2">{ credito?.cliente?.telefono }</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <LocationOnRounded fontSize="small" />
                      <Typography variant="body2">
                        { credito?.cliente?.coordenadasCobro } | { credito?.cliente?.coordenadasCasa }
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsv4T9ZqBnZ3cJ563_zDrWQO9hRIcgzeT46iUEU-Sv6xbdKeSvwL6zBVqaDtmE0v0PiNsYY5FbYlmGo001yC1B-YY2bYqCOGCyByD99aNMNq4TnkwSDtLn8cL_dKtX7_Xbh8fhqm1r-ZqEzoF5KtFbNxVfOPrcWePDsqbFW5qKGX2zQdktL8jMiQj0kWeBwZs6Nv6nLv2gtaoQru8DRCXPOD2TS3SAS1GxZH-GvPyb00er5jh_zDJlHQWnfGmuzHtTYqouFjj2q-Jg"
                    sx={{ width: 96, height: 96 }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Detalles del préstamo */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Detalles del Préstamo
                </Typography>
                <Grid container spacing={2}>
                  {[
                    ["ID del Préstamo", `CR${credito?.id}`],
                    ["Monto", `$ ${ credito?.monto }`],
                    ["Tasa de Interés", `${credito?.interes}%`],
                    ["Fecha de Inicio", fechaInicio],
                    ["Fecha de Fin", fechaVencimiento],
                  ].map(([label, value]) => (
                    <Grid item xs={6} md={4} key={label}>
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right section */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Progreso del Préstamo
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                      variant="determinate"
                      value={porcentajePagado}
                      size={120}
                      thickness={3}
                      sx={{ color: "#005A9C" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        {porcentajePagado}%
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Pagado
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      mt: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pagado
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        $ { pagado }
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Saldo
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        $ { credito?.saldo }
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tablas de cuotas e historial */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Resumen de Cuotas
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  {["Nº Cuota", "Fecha Vencimiento", "Monto", "Monto Pagado", "Estado"].map(
                    (header) => (
                      <TableCell key={header}>{header}</TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                    credito?.cuotas?.sort((a, b) => new Date(a.fecha_pago) - new Date(b.fecha_pago))?.map((cuota, index) => {
                        const fechaPago = cuota.fecha_pago.split('T')[0]
                        const color = cuota.estado === 'pagado' ? 'success' : 'error'
                        return(
                            <TableRow key={index} hover>
                            <TableCell>{cuota.id}</TableCell>
                            <TableCell>{fechaPago}</TableCell>
                            <TableCell>$ {cuota.monto}</TableCell>
                            <TableCell>$ {cuota.monto_pagado}</TableCell>
                            <TableCell>
                                <Chip label={cuota.estado} color={color} size="small" />
                            </TableCell>
                            </TableRow>
                        )
                    })
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Historial de Pagos
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Fecha de Pago",
                    "Monto Pagado",
                    "Método de Pago",
                    "Referencia",
                  ].map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {credito?.pagos?.sort((a, b) => new Date(a.fecha_pago) - new Date(b.fecha_pago))?.map((pago, index)=> {
                    const fecha = pago?.fechaPago?.split('T')[0]
                    return (
                        <TableRow key={index} hover>
                            <TableCell>{fecha}</TableCell>
                            <TableCell>$ {Number(pago.monto).toFixed(2)}</TableCell>
                            <TableCell>{pago.metodoPago}</TableCell>
                            <TableCell>
                            <Typography fontWeight="bold">REF-{pago.id}</Typography>
                            </TableCell>
                        </TableRow>
                    )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default InfoCredito;

InfoCredito.requireAuth = true;